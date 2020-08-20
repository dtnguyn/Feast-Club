const editUserNameQuery
= "UPDATE users SET " +
"name = $1 " + 
"WHERE id = $2 "

const editOauthUserNameQuery
= "UPDATE oauth_users SET " +
"name = $1 " + 
"WHERE id = $2 "

const editEmailPasswordQuery
= "UPDATE users SET " +
"email = $1, " +
"password = $2 " + 
"WHERE id = $3 "

const editAvatarQuery
= "UPDATE users SET " +
"avatar = $1 " + 
"WHERE id = $2 "

const editOauthAvatarQuery
= "UPDATE oauth_users SET " +
"avatar = $1 " + 
"WHERE id = $2 "



module.exports = {
    editUserNameQuery,
    editOauthUserNameQuery,
    editEmailPasswordQuery,
    editAvatarQuery,
    editOauthAvatarQuery
}