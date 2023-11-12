-- SQL script that selects the most energizing track of each release year

CREATE OR REPLACE VIEW tracks_max_energy_by_year AS
SELECT DISTINCT ON (release_year)
    id AS track_id,
    "name" AS track_name,
    popularity AS track_popularity,
    energy,
    danceability,
    release_year
FROM tracks
ORDER BY release_year, energy DESC;
