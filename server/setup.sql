  DROP TABLE IF EXISTS users;
--   DROP TABLE IF EXISTS signatures;
--   DROP TABLE IF EXISTS user_profiles;

  CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name VARCHAR NOT NULL CHECK (name != ''),
       surname VARCHAR NOT NULL CHECK (surname != ''),
       email VARCHAR NOT NULL CHECK (email != '') UNIQUE,
       password VARCHAR NOT NULL CHECK (password != '')
   );