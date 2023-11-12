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
    track_summary
WHERE
    artist_followers IS NOT NULL;
