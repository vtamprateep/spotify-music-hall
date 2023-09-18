SHOW DATABASES ;

CREATE DATABASE music_hall_db;

USE music_hall_db;

CREATE TABLE Venue (venue_id INTEGER,
                    name VARCHAR(255),
                    location VARCHAR(255),
                    PRIMARY KEY (venue_id)
                    );

CREATE TABLE Creators (creator_id VARCHAR(255),
                       name VARCHAR(255),
                       type CHAR(10),
                       popularity INTEGER,
                       years_active_begin INTEGER,
                       years_active_end INTEGER,
                       summary TEXT,
                       genres TEXT,
                       spotify_url VARCHAR(255),
                       followers BIGINT,
                       image_url VARCHAR(255),
                       page_title VARCHAR(255),
                       birth_name VARCHAR(255),
                       birth_place VARCHAR(255),
                       birth_date DATE,
                       origin VARCHAR(255),
                       PRIMARY KEY (creator_id)
                       );




CREATE TABLE Concerts (concert_id INTEGER,
                       creators_id VARCHAR(255),
                       date DATE,
                       concert TEXT,
                       venue_id INTEGER,
                       PRIMARY KEY (concert_id),
                       FOREIGN KEY (creators_id) REFERENCES Creators (creator_id),
                       FOREIGN KEY (venue_id) REFERENCES Venue (venue_id)
                       );

CREATE TABLE Albums (album_id VARCHAR(255),
                     name VARCHAR(255),
                     creator_id VARCHAR(255),
                     release_date DATE,
                     total_tracks INTEGER,
                     image_url VARCHAR(255),
                     spotify_url VARCHAR(255),
                     genres TEXT,
                     PRIMARY KEY (album_id),
                     FOREIGN KEY (creator_id) REFERENCES Creators (creator_id)
                     );

CREATE TABLE Tracks (track_id VARCHAR(255),
                     name VARCHAR(255),
                     album_id VARCHAR(255),
                     explicit BIT,
                     duration_ms INTEGER,
                     track_number INTEGER,
                     popularity INTEGER,
                     preview_url VARCHAR(255),
                     PRIMARY KEY (track_id),
                     FOREIGN KEY (album_id) REFERENCES Albums (album_id)
                     );


CREATE TABLE TrackFeatures (track_feature_id INTEGER,
                            track_id VARCHAR(255),
                            acousticness FLOAT,
                            danceability FLOAT,
                            energy FLOAT,
                            instrumentalness FLOAT,
                            track_key INTEGER,
                            liveness FLOAT,
                            loudness FLOAT,
                            speechiness FLOAT,
                            valence FLOAT,
                            tempo FLOAT,
                            PRIMARY KEY (track_feature_id),
                            FOREIGN KEY (track_id) REFERENCES Tracks (track_id)
                           );


CREATE TABLE Users (user_id INTEGER NOT NULL AUTO_INCREMENT,
                    first_name VARCHAR(255),
                    last_name VARCHAR(255),
                    password VARCHAR(255),
                    PRIMARY KEY (user_id)
                    );


CREATE TABLE Favorites (user_id INTEGER,
                        track_id VARCHAR(255),
                        FOREIGN KEY (user_id) REFERENCES Users (user_id),
                        FOREIGN KEY (track_id) REFERENCES Tracks (track_id)
                    );
