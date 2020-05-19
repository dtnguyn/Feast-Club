import React, {useState, useEffect} from 'react';
import '../../styles/Explore.css';
import LoveButton from './LoveButton';
import CommentButton from './CommentButton';
import axios from 'axios';
import { useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";



const BlogPost = (props) => {

    const [heart, setHeart] = useState(false);
    const global_id = useSelector(state => state.currentUser.id);
    const [socialCount, setSocialCount] = useState({
        hearts: props.hearts,
        comments: 0
    })

    const addHeart = (info, callback) => {
        axios.post("http://localhost:5000/love", info, {withCredentials: true})
            .then((response) => {
                callback(response.data);
                if(response.data) console.log("Successfully love a post");
            })
    }

    const deleteHeart = (info, callback) => {
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
                callback(response.data);
                if(response.data) console.log("Successfully unlove a post");
            })
    }

    useEffect(() => {
        if(props.isHearted) setHeart(true);
    }, [])
    

    return (
        <div className="blog-post">
            <div className="compose-header">
                <img src="/default-user-icon.svg" style={{width: "60px", height: "60px"}} />
                <p className="compose-author">{props.authorName}</p>
                <Dropdown className="toggle">
                    <Dropdown.Toggle variant="info" size="sm"  />
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => {}}>Edit</Dropdown.Item>
                        <Dropdown.Item 
                            onClick={() => {
                                props.requestDeleteBlog();
                            }
                        }>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <p className="compose-date">{props.date}</p>
            </div>
            <div className="compose-content">
                <p className="content-item"><img src="restaurant_name_icon.svg" className="icon-for-content"/> {props.restaurantName}</p>
                <p className="content-item"><img src="restaurant-icon.png" className="icon-for-content"/> {props.address}</p>
                <p className="content-item">{props.content}</p>
            </div>

            <div className="compose-footer">
                <LoveButton handleClick={() => {
                    if(heart) {
                        const info = {
                            blogID: props.blogID,
                            userID: props.userID
                        }
                        deleteHeart(info, (result) => {
                            if(result) {
                                setHeart(false);
                                setSocialCount({...socialCount, hearts: socialCount.hearts - 1})
                            }
                        });
                    } else {
                        const info = {
                            blogID: props.blogID,
                            userID: props.userID
                        }
                        addHeart(info, (result) => {
                            if(result) {
                                setHeart(true);
                                setSocialCount({...socialCount, hearts: socialCount.hearts + 1})
                            }
                        });
                    }
                }} buttonStatus={heart} />
                <p className="social-count">{socialCount.hearts}</p>
                <CommentButton/>
                <p className="social-count">{socialCount.comments}</p>
            </div>
        </div>

            
        
    );
}

export default BlogPost;