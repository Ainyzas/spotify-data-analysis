-- SQL script that combines track information (id, name, popularity, energy, and danceability) 
-- with the number of artist followers

CREATE VIEW tracks_with_followers AS
SELECT
    tracks.id,
    tracks.name,
    tracks.popularity,
    tracks.energy,
    tracks.danceability,
    artists.followers AS artist_followers
FROM
    tracks
JOIN
    artists ON artists.id = ANY (tracks.id_artists::VARCHAR[]);

SELECT *
FROM tracks_with_followers;