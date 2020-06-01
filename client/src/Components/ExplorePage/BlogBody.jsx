import React from 'react';

import ImageSlide from "../SharedComponents/ImageSlide"

import "../../styles/Explore.css"

const BlogBody = (props) => {
    return(

        <div className="row">
            <div className={"compose-content " + (props.images == null ? "col-12" : "col-lg-6 col-md-12")}>
                <p className="content-item"><img src="restaurant_name_icon.svg" className="icon-for-content"/> {props.restaurantName}</p>
                <p className="content-item"><img src="restaurant-icon.png" className="icon-for-content"/> {props.address}</p>
                <p className="content-item" id="blog-text-content">{props.content}</p>
            </div>
            
            <div className={(props.images == null ? "col-0" : "col-lg-6 col-md-12")}>
                <ImageSlide images={props.images == null ? [] : props.images} />
            </div>

        </div>
        


    );
}

export default BlogBody;