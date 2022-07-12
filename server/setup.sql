  DROP TABLE IF EXISTS resetpassword;
  DROP TABLE IF EXISTS users;

--   DROP TABLE IF EXISTS signatures;
--   DROP TABLE IF EXISTS user_profiles;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL CHECK (name != ''),
    surname VARCHAR NOT NULL CHECK (surname != ''),
    email VARCHAR NOT NULL CHECK (email != '') UNIQUE,
    password VARCHAR NOT NULL CHECK (password != '')
    photoUrl VARCHAR NOT NULL CHECK (surname != ''),

);


-- CREATE TABLE users_profile (
--     id SERIAL PRIMARY KEY,
--     user_id INT REFERENCES users(id) UNIQUE,
--     photoUrl VARCHAR NOT NULL CHECK (surname != ''),
-- );

CREATE TABLE resetpassword (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL CHECK (email != '') REFERENCES users(email),
    code VARCHAR NOT NULL CHECK (code != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
