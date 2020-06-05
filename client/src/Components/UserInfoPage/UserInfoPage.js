import React, {useState} from 'react';
import InfoNavbar from "../SharedComponents/InfoNavbar"
import UserInfoCard from "./UserInfoCard"
import ChangeEmailPasswordJumboTron from "./ChangeEmailPasswordJumbotron"
import LinearProgress from '@material-ui/core/LinearProgress';
import { useSelector } from "react-redux"

import axios from 'axios'

import "../../styles/UserInfoPage.css"

const UserInfoPage = () => {

    const [loading, setLoading] = useState(false);

    const currentUser = useSelector(state => state.currentUser);
    console.log(currentUser);


    const changeAvatar = (newAvatar) => {
        var formData = new FormData();
        formData.append('image', newAvatar)
        console.log("Change avatar!", formData, newAvatar)
        axios.patch("http://localhost:5000/userSettings/avatar", formData, {
            params: {
                isOauth: currentUser.isOauth
            },
            withCredentials: true
        })  
            .then((response) => {

            })
    }

    return(
        <div>
            <InfoNavbar/>
            <div className="user-info-page">
                {loading ? <LinearProgress color="secondary" /> : null}
                <UserInfoCard 
                    imageAction={changeAvatar}
                    startLoading={() => setLoading(true)} 
                    stopLoading={() => setLoading(false)} 
                />
                <ChangeEmailPasswordJumboTron/>
            </div>
        </div>
        
    )
}


export default UserInfoPage;