import AWS from 'aws-sdk';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-north-1',
});

const { Client } = pg;
const db = new Client({
    connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_ENDPOINT}:5432/${process.env.DB_NAME}`,
    ssl: {
        rejectUnauthorized: false,
    },
});

db.connect();

async function copyS3DataToArtists(bucket, key) {
    const s3Object = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    const jsonData = s3Object.Body.toString();
    const data = JSON.parse(jsonData);

    for (const entry of data) {
        const { id, followers, genres, name, popularity } = entry;
        const query = {
            text: 'INSERT INTO artists(id, followers, genres, name, popularity) VALUES($1, $2, $3, $4, $5)',
            values: [id, followers, genres.replace('[', '{').replace(']', '}'), name, popularity],
        };
        await db.query(query);
    }
}

async function copyS3DataToTracks(bucket, key) {
    const s3Object = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    const jsonData = s3Object.Body.toString();
    const data = JSON.parse(jsonData);

    for (const entry of data) {
        const {
            id,
            name,
            popularity,
            duration_ms,
            explicit,
            artists,
            id_artists,
            danceability,
            energy,
            release_year,
            release_month,
            release_day,
        } = entry;

        const query = {
            text: 'INSERT INTO tracks(id, name, popularity, duration_ms, explicit, artists, id_artists, danceability, energy, release_year, release_month, release_day) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
            values: [
                id,
                name,
                popularity,
                duration_ms,
                explicit,
                artists.replace('[', '{').replace(']', '}'),
                id_artists.replace('[', '{').replace(']', '}'),
                danceability,
                energy,
                release_year,
                release_month,
                release_day,
            ],
        };
        await db.query(query);
    }
}

async function main() {
    try {
        await copyS3DataToArtists(process.env.BUCKET_NAME, 'artists.json');
        await copyS3DataToTracks(process.env.BUCKET_NAME, 'tracks.json');
        console.log('Data copied from S3 to PostgreSQL for "artists" and "tracks" tables');
    } catch (error) {
        console.error('Error copying data:', error);
    } finally {
        db.end();
    }
}

main();
