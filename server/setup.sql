  DROP TABLE IF EXISTS resetpassword;
  DROP TABLE IF EXISTS users;

--   DROP TABLE IF EXISTS signatures;
--   DROP TABLE IF EXISTS user_profiles;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL CHECK (name != ''),
    surname VARCHAR NOT NULL CHECK (surname != ''),
    email VARCHAR NOT NULL CHECK (email != '') UNIQUE,
    password VARCHAR NOT NULL CHECK (password != ''),
    photourl VARCHAR,
    bio VARCHAR
);

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id) NOT NULL,
    accepted BOOLEAN DEFAULT false
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wall_posts(
    id SERIAL PRIMARY KEY,
    walluser_id INT REFERENCES users(id) NOT NULL,
    writer_id INT REFERENCES users(id) NOT NULL,
    post TEXT,
    likes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wall_coments(
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES wall_posts(id) NOT NULL,
    writer_id INT REFERENCES users(id) NOT NULL,
    post TEXT,
    likes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resetpassword (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL CHECK (email != '') REFERENCES users(email),
    code VARCHAR NOT NULL CHECK (code != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* 
For Delet table:
- wall Commments -> wall post & users -> users
- reset Password -> users
- friendship -> users

 */