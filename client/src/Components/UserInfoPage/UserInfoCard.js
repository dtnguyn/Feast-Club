import React from "react";
import "../../styles/UserInfoPage.css"

const UserInfoCard = () => {
    return(
        <div className="user-info-card-container">
            <div className="user-info-card">
                <img className="avatar-image user-image-lg" src="/default-user-icon.svg"/>
                <div className="user-info-card-text-container">
                    <p className="user-info-card-text user-name-info">
                        Adron Nguyen 
                        <img src="/edit-username-icon.svg" className="small-button press-button" id="edit-user-icon"/>
                    </p>
                    <p className="user-info-card-text">Posts 0</p>
                    <p className="user-info-card-text">Like 0</p>
                </div>
            </div>
        </div>
        
    )
}

export default UserInfoCard