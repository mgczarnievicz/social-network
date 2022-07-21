DROP TABLE IF EXISTS resetpassword;
DROP TABLE IF EXISTS friendships;

DROP TABLE IF EXISTS wall_posts_likes;
DROP TABLE IF EXISTS wall_posts;

DROP TABLE IF EXISTS wall_comments_likes;
DROP TABLE IF EXISTS wall_comments;


DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL CHECK (name != ''),
    surname VARCHAR NOT NULL CHECK (surname != ''),
    email VARCHAR NOT NULL CHECK (email != '') UNIQUE,
    password VARCHAR NOT NULL CHECK (password != ''),
    photourl VARCHAR,
    bio VARCHAR
);

CREATE TABLE resetpassword (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL CHECK (email != '') REFERENCES users(email),
    code VARCHAR NOT NULL CHECK (code != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id) NOT NULL,
    accepted BOOLEAN DEFAULT false
);

CREATE TABLE wall_posts(
    id SERIAL PRIMARY KEY,
    walluser_id INT REFERENCES users(id) NOT NULL,
    writer_id INT REFERENCES users(id) NOT NULL,
    post TEXT,
  ""  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wall_posts_likes(
    id SERIAL PRIMARY KEY,
    wallpost_id INT REFERENCES wall_posts(id) NOT NULL,
    users_id INT REFERENCES users(id) NOT NULL
);

CREATE TABLE wall_comments(
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES wall_posts(id) NOT NULL,
    writer_id INT REFERENCES users(id) NOT NULL,
    post TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wall_comments_likes(
    id SERIAL PRIMARY KEY,
    wallcomments_id INT REFERENCES wall_comments(id) NOT NULL,
    users_id INT REFERENCES users(id) NOT NULL
);


CREATE TABLE message_general(
    id SERIAL PRIMARY KEY,
    sender INT REFERENCES users(id) NOT NULL,
    message TEXT
    send_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE message_individual(
    id SERIAL PRIMARY KEY,
    sender INT REFERENCES users(id) NOT NULL,
    reciever INT REFERENCES users(id) NOT NULL
    message TEXT
    send_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



/* 
For Delet table:
- wall Commments -> wall post & users -> users
- reset Password -> users
- friendship -> users

 */