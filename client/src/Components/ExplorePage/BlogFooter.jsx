import React from 'react';
import LoveButton from './LoveButton';
import CommentButton from './CommentButton';
import "../../styles/Explore.css"

const BlogFooter = (props) => {
    return(
        <div className="compose-footer">
            <LoveButton handleClick={() => {
                if(props.heart) {
                    const info = {
                        blogID: props.blogID,
                        userID: props.userID
                    }
                    props.deleteHeart(info);
                } else {
                    const info = {
                        blogID: props.blogID,
                        userID: props.userID
                    }
                    props.addHeart(info);
                }
            }} buttonStatus={props.heart} />
            <p className="social-count">{props.socialCount.hearts}</p>
            <CommentButton handleClick={props.goToDetailPage}/>
            <p className="social-count">{props.socialCount.comments}</p>
        </div>
    );
}

export default BlogFooter;