import React from 'react';
import "../../styles/Explore.css"

const CommentButton = (props) => {
    return(
        <div>
            <img onClick={props.handleClick} className="comment-icon" src="comment_icon.svg" />
        </div>
    );

}

export default CommentButton