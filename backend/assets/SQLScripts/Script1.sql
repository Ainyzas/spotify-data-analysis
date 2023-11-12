-- SQL script that takes track information (id, name, popularity, energy, and danceability) 

CREATE OR REPLACE VIEW track_summary AS
SELECT
    id AS track_id,
    "name" AS track_name,
    popularity AS track_popularity,
    energy,
    danceability
FROM tracks;

