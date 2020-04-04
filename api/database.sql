CREATE TABLE users(
   id VARCHAR(50) PRIMARY KEY,
   name VARCHAR (50) NOT NULL,
   email VARCHAR(50) NOT NULL,
   password VARCHAR(256) NOT NULL
);

CREATE TABLE oauth_users(
   id VARCHAR(50) PRIMARY KEY,
   name VARCHAR (50) NOT NULL,
   email VARCHAR(50) NOT NULL
);

CREATE TABLE user_locations(
   user_id VARCHAR(50) PRIMARY KEY,
   latitude numeric(9, 6) NOT NULL,
   longitude numeric(9, 6) NOT NULL,
   city VARCHAR(50) NOT NULL,
   state VARCHAR(50),
   country VARCHAR(50) NOT NULL
   FOREIGN KEY (user_id) REFERENCES users (id),
   FOREIGN KEY (user_id) REFERENCES oauth_users (id)
);

CREATE TABLE user_ids(
   id VARCHAR(50) PRIMARY KEY,
   email VARCHAR(50) NOT NULL
)
ALTER TABLE user_locations
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_ids(id);

ALTER TABLE oauth_users
ADD CONSTRAINT unique_oauth_email UNIQUE (email);