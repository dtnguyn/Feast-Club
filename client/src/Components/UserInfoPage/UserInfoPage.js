import React from 'react';
import InfoNavbar from "../SharedComponents/InfoNavbar"
import UserInfoCard from "./UserInfoCard"

import "../../styles/UserInfoPage.css"

const UserInfoPage = () => {
    return(
        <div className="user-info-page">
            <InfoNavbar/>
            <UserInfoCard/>
        </div>
    )
}


export default UserInfoPage;