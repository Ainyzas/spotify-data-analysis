-- SQL script that selects the most energizing track of each release year

CREATE VIEW most_energizing_tracks_per_year AS
SELECT DISTINCT ON (release_year)
    t.id,
    t.name,
    t.popularity,
    t.energy,
    t.danceability,
    t.artist_followers,
    t.release_year
FROM
    tracks_with_followers_filter t
ORDER BY
    t.release_year, t.energy DESC;
    
SELECT *
FROM most_energizing_tracks_by_year;