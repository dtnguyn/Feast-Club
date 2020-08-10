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

CREATE TABLE verify_codes(
   user_id VARCHAR PRIMARY KEY,
   code DECIMAL,
   expire_time TIMESTAMP
)


CREATE TABLE user_ids(
   id VARCHAR(50) PRIMARY KEY,
   email VARCHAR(50) NOT NULL
)
ALTER TABLE user_locations
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_ids(id);

ALTER TABLE oauth_users
ADD CONSTRAINT unique_oauth_email UNIQUE (email);

-- CREATE TABLE restaurants(
--    id VARCHAR(50) PRIMARY KEY,
--    name varchar(50) NOT NULL,
--    latitude numeric(9, 6) NOT NULL,
--    longitude numeric(9, 6) NOT NULL,
--    address varchar(100) NOT NULL,
-- );


CREATE TABLE user_blogs(
   id varchar PRIMARY KEY,
   restaurant_id VARCHAR(50) NOT NULL,
   user_id VARCHAR(50) NOT NULL,
   author_name varchar(30) NOT NULL,
   restaurant_name varchar(30) NOT NULL,
   restaurant_address varchar NOT NULL,
   content VARCHAR NOT NULL,
   date_posted TIMESTAMP NOT NULL,
   FOREIGN KEY (user_id) REFERENCES user_ids (id) ON DELETE CASCADE
);

CREATE TABLE user_blog_location(
   blog_id varchar PRIMARY KEY,
   city varchar(30) NOT NULL,
   country varchar(30) NOT NULL,
   FOREIGN KEY (blog_id) REFERENCES user_blogs (id) ON DELETE CASCADE
);

CREATE TABLE user_blog_hearts(
   id varchar PRIMARY KEY,
   blog_id varchar NOT NULL,
   user_id varchar(50) NOT NULL,
   FOREIGN KEY (blog_id) REFERENCES user_blogs (id) ON DELETE CASCADE,
   FOREIGN KEY (user_id) REFERENCES user_ids (id)
);

SELECT id, user_id, user_ava, author_name, restaurant_name, restaurant_address, content, date, city, country, hearts, is_liked FROM
(SELECT user_blogs.id, user_blogs.user_id, users.avatar as user_ava, author_name, restaurant_name, restaurant_address, content, TO_CHAR(Date(date_posted), 'DD Mon YYYY') as date  
FROM user_blogs, users 
WHERE user_blogs.user_id = users.id 
UNION ALL 
SELECT user_blogs.id, user_blogs.user_id, oauth_users.avatar as user_ava, author_name, restaurant_name, restaurant_address, content, TO_CHAR(Date(date_posted), 'DD Mon YYYY') as date  
FROM user_blogs, oauth_users 
WHERE user_blogs.user_id = oauth_users.id
) as blogs  

INNER JOIN user_blog_location ON user_blog_location.blog_id = id

LEFT JOIN (
SELECT blog_id, COUNT(*) as hearts,
	CASE user_id WHEN '817de5fa-0b1a-43b2-8811-512100b85b96' THEN 1
		else 0
	END as is_liked
FROM user_blog_hearts
GROUP BY blog_id, user_id
) as hearts ON hearts.blog_id = id

WHERE city = 'Hồ Chí Minh' AND country = 'Vietnam' 
ORDER BY date DESC   


CREATE TABLE user_blog_comments(
   id varchar PRIMARY KEY,
   blog_id varchar NOT NULL,
   user_id varchar(50) NOT NULL,
   author_name varchar(50) NOT NULL,
   comment_content varchar NOT NULL,
   date_posted TIMESTAMP NOT NULL,
   FOREIGN KEY (blog_id) REFERENCES user_blogs (id) ON DELETE CASCADE,
   FOREIGN KEY (user_id) REFERENCES user_ids (id)
);

CREATE TABLE user_blog_images(
   id SERIAL PRIMARY KEY,
   image_url varchar,
   blog_id varchar NOT NULL,
   FOREIGN KEY (blog_id) REFERENCES user_blogs (id) ON DELETE CASCADE
)




/* Queries */


/*GET Blogs*/
SELECT id, user_id, user_ava, author_name, restaurant_name, restaurant_address, content, city, country, hearts::INTEGER, is_hearted, comments::INTEGER, date_posted, TO_CHAR(Date(date_posted), 'DD Mon YYYY') as date FROM
(SELECT user_blogs.id, user_blogs.user_id, users.avatar as user_ava, author_name, restaurant_name, restaurant_address, content, date_posted 
FROM user_blogs, users 
WHERE user_blogs.user_id = users.id 
UNION ALL 
SELECT user_blogs.id, user_blogs.user_id, oauth_users.avatar as user_ava, author_name, restaurant_name, restaurant_address, content, date_posted 
FROM user_blogs, oauth_users 
WHERE user_blogs.user_id = oauth_users.id) as blogs 

INNER JOIN user_blog_location ON user_blog_location.blog_id = id 

LEFT JOIN ( 
SELECT heart_count.blog_id, hearts, 
	CASE is_hearted WHEN 1 
	THEN 1
	ELSE 0
	END as is_hearted
FROM(
	SELECT blog_id, COUNT(blog_id) as hearts
	FROM user_blog_hearts
	GROUP BY blog_id
) as heart_count
left JOIN (
	SELECT blog_id, COUNT(blog_id) as is_hearted FROM(
		SELECT blog_id
		FROM user_blog_hearts
		WHERE user_id = '103545972077000374345'
		) as a
	GROUP BY blog_id
) as is_hearted
ON is_hearted.blog_id = heart_count.blog_id
) as hearts ON hearts.blog_id = id 

LEFT JOIN ( 
SELECT blog_id, COUNT(*) as comments 
FROM user_blog_comments 
GROUP BY blog_id
) as comments ON comments.blog_id = id 

WHERE city = 'Hồ Chí Minh' AND country = 'Vietnam' 
ORDER BY date_posted DESC