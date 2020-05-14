import React from 'react';
import '../../styles/Explore.css';

const BlogPost = (props) => {


    return (
        <div className="blog-post">
            <div className="compose-header">
                <img src="/default-user-icon.svg" style={{width: "60px", height: "60px"}} />
                <p className="compose-author">{props.authorName}</p>
                <p className="compose-date">{props.date}</p>
            </div>
            <div className="compose-content">
                <p className="content-item"><img src="restaurant_name_icon.svg" className="icon-for-content"/> {props.restaurantName}</p>
                <p className="content-item"><img src="restaurant-icon.png" className="icon-for-content"/> {props.address}</p>
                <p className="content-item">{props.content}</p>

            </div>
            
        </div>
    );
}

export default BlogPost;