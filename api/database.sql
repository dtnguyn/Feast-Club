CREATE TABLE oauth_users(
   id VARCHAR(50) PRIMARY KEY,
   email VARCHAR(50) NOT NULL,
   name VARCHAR (50) NOT NULL,
   latitude numeric(9, 6),
   longitude numeric(9, 6)
);