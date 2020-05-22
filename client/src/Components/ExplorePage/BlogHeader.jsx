import React from 'react';
import Dropdown from "react-bootstrap/Dropdown";
import "../../styles/Explore.css"

const BlogHeader = (props) => {
    return(
        <div className="compose-header">
            <img src="/default-user-icon.svg" style={{width: "60px", height: "60px"}} />
            <p className="compose-author">{props.authorName}</p>
            <Dropdown className="toggle">
                <Dropdown.Toggle variant="info" size="sm"  />
                <Dropdown.Menu>
                    <Dropdown.Item onClick={props.triggerEditDialog}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={props.requestDeleteBlog}>Delete</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <p className="compose-date">{props.date}</p>
        </div>
    );
}

export default BlogHeader;