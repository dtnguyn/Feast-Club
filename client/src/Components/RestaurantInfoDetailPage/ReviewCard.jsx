import React from 'react';
import { useSelector } from 'react-redux';
import '../../styles/RestaurantInfoDetail.css';

function ReviewCard(props){
    const global_user = useSelector(state => state.currentUser);
    return(
        <div className="review-card row" >
            <div className="col-md-2">
                <img 
                    className="user-review-avatar" 
                    src={props.img} 
                />
                {props.type == "review"
                 ? <p>{props.rating}.0</p> 
                 : null}
            </div>

            <div className="review-box col-md-10">
               <p id="review-author">{props.author}</p>
               <p id="review-content">{props.content}</p> 
               {props.type == "comment" && props.userID == global_user.id 
               ? <img onClick={() => props.deleteComment({commentID: props.commentID})} class="small-button press-button" src="/delete_icon.svg"/>
               : null}

            </div>
        </div>
    );
}

export default ReviewCard

