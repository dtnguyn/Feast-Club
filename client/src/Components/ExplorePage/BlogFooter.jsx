import React from 'react';
import LoveButton from './LoveButton';
import CommentButton from './CommentButton';
import "../../styles/Explore.css"
import { useSelector } from 'react-redux'

const BlogFooter = (props) => {

    const global_user = useSelector(state => state.currentUser)
    return(
        <div className="compose-footer">
            <LoveButton handleClick={() => {
                if(props.heart) {
                    const info = {
                        blogID: props.blogID,
                        userID: global_user.id
                    }
                    props.deleteHeart(info);
                } else {
                    const info = {
                        blogID: props.blogID,
                        userID: global_user.id
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