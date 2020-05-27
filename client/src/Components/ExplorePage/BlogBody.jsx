import React from 'react';

import "../../styles/Explore.css"

const BlogBody = (props) => {
    return(
        <div className="compose-content">
            <p className="content-item"><img src="restaurant_name_icon.svg" className="icon-for-content"/> {props.restaurantName}</p>
            <p className="content-item"><img src="restaurant-icon.png" className="icon-for-content"/> {props.address}</p>
            <p className="content-item" id="blog-text-content">{props.content}</p>
        </div>
    );
}

export default BlogBody;