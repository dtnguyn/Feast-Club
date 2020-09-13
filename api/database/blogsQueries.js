const getBlogsQuery 
= "SELECT id, user_id, user_ava, author_name, restaurant_name, restaurant_address, content, city, country, images, hearts::INTEGER, is_hearted, comments::INTEGER, date_posted, TO_CHAR(Date(date_posted), 'DD Mon YYYY') as date FROM " +
"(SELECT user_blogs.id, user_blogs.user_id, users.avatar as user_ava, users.name as author_name, restaurant_name, restaurant_address, content, date_posted " +
"FROM user_blogs, users " +
"WHERE user_blogs.user_id = users.id " +
"UNION ALL " +
"SELECT user_blogs.id, user_blogs.user_id, oauth_users.avatar as user_ava, oauth_users.name as author_name, restaurant_name, restaurant_address, content, date_posted " +
"FROM user_blogs, oauth_users " +
"WHERE user_blogs.user_id = oauth_users.id) as blogs " +

"INNER JOIN user_blog_location ON user_blog_location.blog_id = id " +

"LEFT JOIN ( " +
"SELECT heart_count.blog_id, hearts, " +
"    CASE is_hearted WHEN 1 " +
"    THEN 1 " +
"    ELSE 0 " +
"    END as is_hearted " +
"FROM( " +
"    SELECT blog_id, COUNT(blog_id) as hearts " +
"    FROM user_blog_hearts " +
"   GROUP BY blog_id " +
") as heart_count " +
"left JOIN ( " +
"    SELECT blog_id, COUNT(blog_id) as is_hearted FROM( " +
"        SELECT blog_id " +
"        FROM user_blog_hearts " +
"        WHERE user_id = $1 " +
"        ) as a " +
"    GROUP BY blog_id " +
") as is_hearted " +
"ON is_hearted.blog_id = heart_count.blog_id " +
") as hearts ON hearts.blog_id = id " +

"LEFT JOIN ( " +
"SELECT blog_id, COUNT(*) as comments " +
"FROM user_blog_comments " +
"GROUP BY blog_id " +
") as comments ON comments.blog_id = id  " +

"LEFT JOIN ( " +
"    SELECT blog_id, array_agg(image_url) AS images " +
"    FROM user_blog_images " +
"    GROUP BY blog_id " +
"    ) as images ON images.blog_id = id " +

"WHERE city = $2 AND country = $3 " +
"ORDER BY date_posted DESC ";

const getUserBlogsQuery 
= "SELECT id, user_id, user_ava, author_name, restaurant_name, restaurant_address, content, city, country, images, hearts::INTEGER, is_hearted, comments::INTEGER, date_posted, TO_CHAR(Date(date_posted), 'DD Mon YYYY') as date FROM " +
"(SELECT user_blogs.id, user_blogs.user_id, users.avatar as user_ava, users.name as author_name, restaurant_name, restaurant_address, content, date_posted " +
"FROM user_blogs, users " +
"WHERE user_blogs.user_id = users.id " +
"UNION ALL " +
"SELECT user_blogs.id, user_blogs.user_id, oauth_users.avatar as user_ava, oauth_users.name as author_name, restaurant_name, restaurant_address, content, date_posted " +
"FROM user_blogs, oauth_users " +
"WHERE user_blogs.user_id = oauth_users.id) as blogs " +

"INNER JOIN user_blog_location ON user_blog_location.blog_id = id " +

"LEFT JOIN ( " +
"SELECT heart_count.blog_id, hearts, " +
"    CASE is_hearted WHEN 1 " +
"    THEN 1 " +
"    ELSE 0 " +
"    END as is_hearted " +
"FROM( " +
"    SELECT blog_id, COUNT(blog_id) as hearts " +
"    FROM user_blog_hearts " +
"   GROUP BY blog_id " +
") as heart_count " +
"left JOIN ( " +
"    SELECT blog_id, COUNT(blog_id) as is_hearted FROM( " +
"        SELECT blog_id " +
"        FROM user_blog_hearts " +
"        WHERE user_id = $1 " +
"        ) as a " +
"    GROUP BY blog_id " +
") as is_hearted " +
"ON is_hearted.blog_id = heart_count.blog_id " +
") as hearts ON hearts.blog_id = id " +

"LEFT JOIN ( " +
"SELECT blog_id, COUNT(*) as comments " +
"FROM user_blog_comments " +
"GROUP BY blog_id " +
") as comments ON comments.blog_id = id  " +

"LEFT JOIN ( " +
"    SELECT blog_id, array_agg(image_url) AS images " +
"    FROM user_blog_images " +
"    GROUP BY blog_id " +
"    ) as images ON images.blog_id = id " +

"WHERE user_id = $1 " +
"ORDER BY date_posted DESC ";

const getUserLikedBlogsQuery
= "SELECT id, user_id, user_ava, author_name, restaurant_name, restaurant_address, content, city, country, images, hearts::INTEGER, is_hearted, comments::INTEGER, date_posted, TO_CHAR(Date(date_posted), 'DD Mon YYYY') as date FROM " +
"(SELECT user_blogs.id, user_blogs.user_id, users.avatar as user_ava, author_name, restaurant_name, restaurant_address, content, date_posted " +
"FROM user_blogs, users " +
"WHERE user_blogs.user_id = users.id " +
"UNION ALL " +
"SELECT user_blogs.id, user_blogs.user_id, oauth_users.avatar as user_ava, author_name, restaurant_name, restaurant_address, content, date_posted " +
"FROM user_blogs, oauth_users " +
"WHERE user_blogs.user_id = oauth_users.id) as blogs " +

"INNER JOIN user_blog_location ON user_blog_location.blog_id = id " +

"LEFT JOIN ( " +
"SELECT heart_count.blog_id, hearts, " +
"    CASE is_hearted WHEN 1 " +
"    THEN 1 " +
"    ELSE 0 " +
"    END as is_hearted " +
"FROM( " +
"    SELECT blog_id, COUNT(blog_id) as hearts " +
"    FROM user_blog_hearts " +
"   GROUP BY blog_id " +
") as heart_count " +
"left JOIN ( " +
"    SELECT blog_id, COUNT(blog_id) as is_hearted FROM( " +
"        SELECT blog_id " +
"        FROM user_blog_hearts " +
"        WHERE user_id = $1 " +
"        ) as a " +
"    GROUP BY blog_id " +
") as is_hearted " +
"ON is_hearted.blog_id = heart_count.blog_id " +
") as hearts ON hearts.blog_id = id " +

"LEFT JOIN ( " +
"SELECT blog_id, COUNT(*) as comments " +
"FROM user_blog_comments " +
"GROUP BY blog_id " +
") as comments ON comments.blog_id = id  " +

"LEFT JOIN ( " +
"    SELECT blog_id, array_agg(image_url) AS images " +
"    FROM user_blog_images " +
"    GROUP BY blog_id " +
"    ) as images ON images.blog_id = id " +

"WHERE is_hearted = 1 " +
"ORDER BY date_posted DESC ";


const searchBlogsPostQuery
= "SELECT id, user_id, user_ava, author_name, restaurant_name, restaurant_address, content, city, country, images, hearts::INTEGER, is_hearted, comments::INTEGER, date_posted, TO_CHAR(Date(date_posted), 'DD Mon YYYY') as date FROM " +
"(SELECT user_blogs.id, user_blogs.user_id, users.avatar as user_ava, users.name as author_name, restaurant_name, restaurant_address, content, date_posted " +
"FROM user_blogs, users " +
"WHERE user_blogs.user_id = users.id " +
"UNION ALL " +
"SELECT user_blogs.id, user_blogs.user_id, oauth_users.avatar as user_ava, oauth_users.name as author_name, restaurant_name, restaurant_address, content, date_posted " +
"FROM user_blogs, oauth_users " +
"WHERE user_blogs.user_id = oauth_users.id) as blogs " +

"INNER JOIN user_blog_location ON user_blog_location.blog_id = id " +

"LEFT JOIN ( " +
"SELECT heart_count.blog_id, hearts, " +
"    CASE is_hearted WHEN 1 " +
"    THEN 1 " +
"    ELSE 0 " +
"    END as is_hearted " +
"FROM( " +
"    SELECT blog_id, COUNT(blog_id) as hearts " +
"    FROM user_blog_hearts " +
"   GROUP BY blog_id " +
") as heart_count " +
"left JOIN ( " +
"    SELECT blog_id, COUNT(blog_id) as is_hearted FROM( " +
"        SELECT blog_id " +
"        FROM user_blog_hearts " +
"        WHERE user_id = $1 " +
"        ) as a " +
"    GROUP BY blog_id " +
") as is_hearted " +
"ON is_hearted.blog_id = heart_count.blog_id " +
") as hearts ON hearts.blog_id = id " +

"LEFT JOIN ( " +
"SELECT blog_id, COUNT(*) as comments " +
"FROM user_blog_comments " +
"GROUP BY blog_id " +
") as comments ON comments.blog_id = id  " +

"LEFT JOIN ( " +
"    SELECT blog_id, array_agg(image_url) AS images " +
"    FROM user_blog_images " +
"    GROUP BY blog_id " +
"    ) as images ON images.blog_id = id " +

"WHERE city = $2 AND country = $3 AND " +
"(content LIKE $4 OR restaurant_name LIKE $4 OR restaurant_address LIKE $4 OR author_name LIKE $4)" +
"ORDER BY date_posted DESC ";


const addBlogsQuery
= "INSERT INTO user_blogs VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";


const addBlogsLocationQuery
= "INSERT INTO user_blog_location VALUES($1, $2, $3)";


const editBlogsQuery
= "UPDATE user_blogs SET " +
"restaurant_id = $1, " +
"restaurant_name = $2, " +
"restaurant_address = $3, " + 
"content = $4 " +
"WHERE id = $5 ";

const editBlogsLocationQuery
= "UPDATE user_blog_location SET " +
"city = $1, " +
"country = $2 " + 
"WHERE blog_id = $3 ";


const deleteBlogsQuery
= "DELETE FROM user_blogs WHERE id = $1";


const addHeartQuery
= "INSERT INTO user_blog_hearts VALUES ($1, $2, $3)";


const deleteHeartQuery
= "DELETE FROM user_blog_hearts WHERE id = $1 "


const getCommentsQuery
= "SELECT *, TO_CHAR(Date(date_posted), 'DD Mon YYYY') as date FROM " +
"(SELECT user_blog_comments.id as comment_id, blog_id, user_id, users.name as author_name, comment_content, users.avatar, date_posted " +
"FROM user_blog_comments, users " +
"WHERE user_id = users.id " +
"UNION ALL " +
"SELECT user_blog_comments.id as comment_id, blog_id, user_id, oauth_users.name as author_name, comment_content, oauth_users.avatar, date_posted " +
"FROM user_blog_comments, oauth_users " +
"WHERE user_id = oauth_users.id) as comments " +
"WHERE blog_id = $1 " +
"ORDER BY date_posted DESC";

const addCommentsQuery
= "INSERT INTO user_blog_comments VALUES($1, $2, $3, $4, $5, $6)";

const deleteCommentQuery
= "DELETE FROM user_blog_comments WHERE id = $1";

const uploadImageToDatabaseQuery
= "INSERT INTO user_blog_images (blog_id, image_url) VALUES($1, $2)"

module.exports = {
    getBlogsQuery: getBlogsQuery,
    getUserBlogsQuery: getUserBlogsQuery,
    getUserLikedBlogsQuery,
    searchBlogsPostQuery,
    addBlogsQuery,
    addBlogsLocationQuery,
    editBlogsQuery,
    editBlogsLocationQuery,
    deleteBlogsQuery,
    addHeartQuery,
    deleteHeartQuery,
    getCommentsQuery,
    addCommentsQuery,
    deleteCommentQuery,
    uploadImageToDatabaseQuery
}