CREATE TABLE artists (
    id VARCHAR PRIMARY KEY,
    followers VARCHAR,
    genres TEXT[],
    name VARCHAR,
    popularity INT
);

CREATE TABLE tracks (
    id VARCHAR PRIMARY KEY,
    name TEXT,
    popularity INT,
    duration_ms INT,
    explicit INT,
    artists TEXT[],
    id_artists VARCHAR[],
    danceability TEXT,
    energy REAL,
    release_year VARCHAR,
    release_month VARCHAR,
    release_day VARCHAR
);