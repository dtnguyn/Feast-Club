import React from 'react';
import Dropdown from "react-bootstrap/Dropdown";
import "../../styles/Explore.css";
import { useSelector } from "react-redux";

const BlogHeader = (props) => {
    const global_user = useSelector(state => state.currentUser);
    return(
        <div className="compose-header">
            <img src={props.avatar} alt="/default-user-icon.svg" className="avatar-image avatar-image-md"/>
            <p className="compose-author">{props.authorName}</p>
            {global_user.id == props.userID 
            ? <div>
                <img src="/delete_icon.svg" className="small-button press-button" onClick={props.requestDeleteBlog}/>
                <img src="/edit_icon.svg" className="small-button press-button" onClick={props.triggerEditDialog}/>
            </div>
            : null}  
            <p className="compose-date">{props.date}</p>
        </div>
    );
}

export default BlogHeader;