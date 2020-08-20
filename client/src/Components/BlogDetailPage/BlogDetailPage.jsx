import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import BlogHeader from "../ExplorePage/BlogHeader";
import BlogBody from  "../ExplorePage/BlogBody";
import BlogFooter from "../ExplorePage/BlogFooter";
import axios from 'axios';
import ReviewCard from "../RestaurantInfoDetailPage/ReviewCard"

import "../../styles/BlogDetail.css"

const BlogDetailPage = (props) => {
    const blog = props.location.state.blog;
    const global_user = useSelector(state => state.currentUser);
    const [heart, setHeart] = useState(props.location.state.heart);
    const [socialCount, setSocialCount] = useState(props.location.state.socialCount)
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState("");

    const history = useHistory();
    const isLoggedIn = useSelector(state => state.isLoggedIn)
  

    const addHeart = (info) => {
        if(!isLoggedIn){
            history.push("/signin");
            return
        }
        axios.post("http://localhost:5000/blogs/love", info, {withCredentials: true})
            .then((response) => {
                const apiResponse = response.data
                if(apiResponse.status){
                    setHeart(true);
                    setSocialCount({...socialCount, hearts: socialCount.hearts + 1});
                } else if(apiResponse.code == 401){
                    history.push("/signin"); 
                } else {
                    alert(apiResponse.message);
                }
            })
    }

    const deleteHeart = (info) => {
        if(!isLoggedIn){
            history.push("/signin"); 
            return
        }

        axios.delete("http://localhost:5000/blogs/love",
            {
                withCredentials: true,
                params: { 
                    blogID: info.blogID,
                    userID: info.userID
                 } 
            }
        )
            .then((response) => {
                const apiResponse = response.data
                if(apiResponse.status){
                    setHeart(false);
                    setSocialCount({...socialCount, hearts: socialCount.hearts - 1 })
                } else if(apiResponse.code == 401){
                    history.push("/signin"); 
                } else {
                    alert(apiResponse.message);
                }
            })
    }

    const addComment = (info) => {
        if(!isLoggedIn){
            history.push("/signin"); 
            return
        }
        if(info.content === '') return;
        axios.post("http://localhost:5000/blogs/comments", info, {withCredentials: true})
            .then((response) => {
                const apiResponse = response.data
                if(apiResponse.status){
                    getComments();
                    setSocialCount({...socialCount, comments: (socialCount.comments + 1) })
                } else if(apiResponse.code == 401){
                    history.push("/signin"); 
                } else {
                    alert(apiResponse.message);
                }
            })
    }

    const getComments = () => {
        console.log(blog);
        axios.get("http://localhost:5000/blogs/comments", 
        {
            withCredentials: true,
            params: {
                blogID: blog.id
            }
        })
            .then((response) => {
                const apiResponse = response.data
                if(apiResponse.status){
                    setComments(apiResponse.data);
                    setCommentContent("")
                } else {
                    alert(apiResponse.message)
                }
            })
    }

    const deleteComment = (info) => {
        if(!isLoggedIn){
            history.push("/signin"); 
            return
        }
        axios.delete("http://localhost:5000/blogs/comments", 
        {
            withCredentials: true,
            params: { 
                commentID: info.commentID
             } 
        })
            .then((response) => {
                const apiResponse = response.data
                if(apiResponse.status){
                    getComments();
                    setSocialCount({...socialCount, comments: socialCount.comments - 1 })
                } else if(apiResponse.code == 401){
                    history.push("/signin"); 
                } else {
                    alert(apiResponse.message);
                }
            })
    }

    useEffect(() => {
        getComments();
    }, [])



    
    return (
        <div className="blog-detail-page">
            <div className="blog-detail">
                <div>
                    <BlogHeader 
                        authorName={blog.author_name}
                        avatar={blog.user_ava}
                        date={blog.date}
                        triggerEditDialog={props.triggerEditDialog}
                        requestDeleteBlog={props.requestDeleteBlog}
                    />
                    <BlogBody 
                        restaurantName={blog.restaurant_name}
                        address={blog.restaurant_address}
                        content={blog.content}
                        images={blog.images}
                    />
                    <BlogFooter 
                        blogID={blog.id}
                        userID={blog.user_id}
                        heart={heart}
                        setHeart={setHeart}
                        socialCount={socialCount}
                        setSocialCount={setSocialCount}
                        addHeart={addHeart}
                        deleteHeart={deleteHeart}
                    />
                </div>
                <div className="comment-area">
                    <textarea 
                        className="form-control comment-textarea" 
                        value={commentContent}
                        onChange={(event) => setCommentContent(event.target.value)}
                        rows="2" placeholder="Add a comment..." 
                    />
                    <img 
                        className="post-comment-button press-button" 
                        src="/post_comment_icon.svg" 
                        onClick={() => {
                            console.log(blog);
                            addComment({
                                blogID: blog.id,
                                userID: global_user.id,
                                authorName: global_user.name,
                                content: commentContent
                            })
                        }}
                    />
                </div>
            </div>

            <div >
                {comments.map((comment) => {
                    const avatar = comment.avatar != null ? comment.avatar : "/default-user-icon.svg";
                    return(
                        <ReviewCard 
                            type="comment"
                            commentID={comment.comment_id}
                            blogID={comment.blog_id}
                            userID={comment.user_id}
                            author={comment.author_name}
                            img={avatar}
                            content={comment.comment_content}
                            deleteComment={deleteComment}
                        />
                    );
                })}
            </div>
        </div>
        
        
    );

}

export default BlogDetailPage