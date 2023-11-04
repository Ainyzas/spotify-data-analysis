import Papa from 'papaparse';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-north-1',
});

async function ingestAndFilterTracks(file) {
    try {
        const fileData = await fs.readFile(file, 'utf8');
        const tracksData = Papa.parse(fileData, { header: true, dynamicTyping: true, skipEmptyLines: true }).data;

        const validTrackArtistIdsSet = new Set();
        const validTracks = [];

        tracksData.forEach((track) => {
            if (track.name && track.duration_ms >= 60000) {
                validTracks.push(track);

                const artistIds = track.id_artists.split(',').map((id) => id.trim());

                artistIds.forEach((id) => {
                    id = id.replace(/['\[\]]/g, '');
                    validTrackArtistIdsSet.add(id);
                });
            }
        });

        return {
            validTrackArtistIds: validTrackArtistIdsSet,
            validTracks: validTracks,
        };
    } catch (error) {
        throw error;
    }
}

async function ingestAndFilterArtists(file, validTrackArtistIds) {
    try {
        const fileData = await fs.readFile(file, 'utf8');
        const artistsData = Papa.parse(fileData, { header: true, dynamicTyping: true, skipEmptyLines: true }).data;

        const validArtists = artistsData.filter((artist) => validTrackArtistIds.has(artist.id));

        return validArtists;
    } catch (error) {
        throw error;
    }
}

function explodeReleaseDate(track) {
    let release_year = '';
    let release_month = '';
    let release_day = '';

    if (typeof track.release_date === 'string' && track.release_date.includes('-')) {
        const parts = track.release_date.split('-');
        release_year = parts[0];
        release_month = parts[1];
        release_day = parts[2];
    } else {
        release_year += track.release_date;
    }

    delete track.release_date;

    return {
        ...track,
        release_year: release_year,
        release_month: release_month,
        release_day: release_day,
    };
}

function transformDanceability(track) {
    const danceability = track.danceability;
    let danceabilityLabel = 'Unknown';

    if (danceability >= 0 && danceability < 0.5) {
        danceabilityLabel = 'Low';
    } else if (danceability >= 0.5 && danceability <= 0.6) {
        danceabilityLabel = 'Medium';
    } else if (danceability > 0.6 && danceability <= 1) {
        danceabilityLabel = 'High';
    }

    return {
        ...track,
        danceability: danceabilityLabel,
    };
}

function processTracksData(validTracks) {
    const formattedTracks = validTracks.map(explodeReleaseDate);
    const formattedTracksWithDanceability = formattedTracks.map(transformDanceability);

    return formattedTracksWithDanceability;
}

async function uploadToS3(s3, body, bucket, key) {
    await s3
        .putObject({
            Body: JSON.stringify(body),
            Bucket: bucket,
            Key: key,
        })
        .promise();
}

async function main() {
    try {
        // Ingested and filtered tracks data
        const { validTrackArtistIds, validTracks } = await ingestAndFilterTracks('./assets/tracks.csv');

        // Ingested and filtered artist data
        const validArtists = await ingestAndFilterArtists('./assets/artists.csv', validTrackArtistIds);

        // Formatted track data
        const formattedTracksWithDanceability = processTracksData(validTracks);

        // Upload artist and track data to S3
        const s3 = new AWS.S3();
        await uploadToS3(s3, validArtists, 'spotify-analysed-data', 'artists.json');
        await uploadToS3(s3, formattedTracksWithDanceability, 'spotify-analysed-data', 'tracks.json');

        console.log('Data uploaded to S3 successfully');
    } catch (error) {
        console.error('Error ingesting data:', error);
    }
}

main();
