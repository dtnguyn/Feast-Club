import React, {useState} from 'react';
import InfoNavbar from "../SharedComponents/InfoNavbar"
import UserInfoCard from "./UserInfoCard"
import ChangeEmailPasswordJumboTron from "./ChangeEmailPasswordJumbotron"
import LinearProgress from '@material-ui/core/LinearProgress';
import { useSelector } from "react-redux"
import axios from 'axios'
import "../../styles/UserInfoPage.css";
import FormDialog from "../SharedComponents/FormDialog"

const UserInfoPage = () => {

    const [loading, setLoading] = useState(false);

    const currentUser = useSelector(state => state.currentUser);
    console.log(currentUser);


    const changeAvatar = (newAvatar) => {
        setLoading(true);
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
                if(response === true){
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
    }

    const changeUserName = (values) => {
        setLoading(true);
        const newUserName = values[0];
        axios.patch("http://localhost:5000/userSettings/userName", 
        {userName: newUserName, isOauth: currentUser.isOauth}, 
        {withCredentials: true})  
            .then((response) => {
                if(response === true){
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
    }

    return(
        <div>
            <InfoNavbar/>
            <div className="user-info-page">
                <FormDialog 
                    title="Change User Name"
                    message="You may have to wait for a bit before the change can occur."
                    fields={[
                        {
                            label: "User name",
                            value: currentUser.name,
                        },
                        {
                            label: "User name",
                            value: currentUser.name,
                        } 
                    ]}
                    action={changeUserName}
                />
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