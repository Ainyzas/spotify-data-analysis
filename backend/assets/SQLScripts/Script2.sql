-- SQL script that filters tracks based on whether the associated artists have followers

CREATE VIEW tracks_with_followers_filter AS
SELECT
    id,
    name,
    popularity,
    energy,
    danceability,
    artist_followers
FROM
    tracks_with_followers
WHERE
    artist_followers IS NOT NULL;
    
SELECT *
FROM tracks_with_followers_filter;