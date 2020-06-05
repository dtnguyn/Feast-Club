import React, {useState, useEffect} from 'react';
import '../../styles/Explore.css';

import axios from 'axios';

import { useHistory } from "react-router-dom";
import BlogHeader from "./BlogHeader";
import BlogBody from  "./BlogBody";
import BlogFooter from "./BlogFooter";

const BlogPost = (props) => {
    const [heart, setHeart] = useState(false);
    const [socialCount, setSocialCount] = useState({
        hearts: 0,
        comments: 0
    })
    const history = useHistory();

    const addHeart = (info) => {
        axios.post("http://localhost:5000/love", info, {withCredentials: true})
            .then((response) => {
                if(response.data) {
                    setHeart(true);
                    setSocialCount({...socialCount, hearts: socialCount.hearts + 1});
                }
            })
    }

    const deleteHeart = (info) => {
        axios.delete("http://localhost:5000/love",
            {
                withCredentials: true,
                params: { 
                    blogID: info.blogID,
                    userID: info.userID
                 } 
            }
        )
            .then((response) => {
                if(response.data){
                    setHeart(false);
                    setSocialCount({...socialCount, hearts: socialCount.hearts - 1})
                };
            })
    }

    const goToDetailPage = () => {
        console.log(props.blog);
        history.push("/bloginfo", {
            blog: props.blog,   
            heart: heart,
            socialCount: socialCount,
        });
    }

    useEffect(() => {
        setSocialCount({
            hearts: props.hearts,
            comments: props.comments
        })
        if(props.isHearted) setHeart(true);
        else setHeart(false);
    }, [props.blog]);
    

    return (
        <div className="blog-post">
            <BlogHeader 
                userID={props.blog.user_id}
                authorName={props.blog.author_name}
                avatar={props.blog.user_ava}
                date={props.blog.date}
                triggerEditDialog={props.triggerEditDialog}
                requestDeleteBlog={props.requestDeleteBlog}
            />
            <BlogBody 
                restaurantName={props.blog.restaurant_name}
                address={props.blog.restaurant_address}
                content={props.blog.content}
                images={props.blog.images}
            />
            <BlogFooter 
                blog={props.blog}  
                blogID={props.blog.id}
                userID={props.blog.user_id}
                heart={heart}
                setHeart={setHeart}
                socialCount={socialCount}
                setSocialCount={setSocialCount}
                addHeart={addHeart}
                deleteHeart={deleteHeart}
                goToDetailPage={goToDetailPage}
            />
        </div>

            
        
    );
}

export default BlogPost;