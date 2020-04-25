import React from 'react';

import '../../styles/RestaurantInfoDetail.css';

function ReviewCard(props){
    return(
        <div className="review-card row" >
            <div className="col-md-2">
                <img 
                    className="user-review-avatar" 
                    src={props.img} 
                />
                <p>{props.rating}.0</p>
            </div>

            <div className="review-box col-md-10">
               <p id="review-author"> reviewed by {props.author}</p>
               <p id="review-content">{props.content}</p> 
            </div>
        </div>
    );
}

export default ReviewCard

