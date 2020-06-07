import React, {useState} from 'react';
import InfoNavbar from "../SharedComponents/InfoNavbar"
import UserInfoCard from "./UserInfoCard"
import ChangeEmailPasswordJumboTron from "./ChangeEmailPasswordJumbotron"
import LinearProgress from '@material-ui/core/LinearProgress';
import { useSelector } from "react-redux"
import axios from 'axios'
import "../../styles/UserInfoPage.css";
import FormDialog from "../SharedComponents/FormDialog"
import {currentUserSignIn } from "../../actions";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { signOut } from "../../actions";


const UserInfoPage = () => {

    const [loading, setLoading] = useState(false);

    const [openUserNameDialog, setOpenUserNameDialog] = useState(false);
    const [openVerifyCodeDialog, setOpenVerifyCodeDialog] = useState(false);
    const [openEmailPasswordDialog, setOpenEmailPasswordDialog] = useState(false);

    const currentUser = useSelector(state => state.currentUser);
    const history = useHistory();
    
    const dispatch = useDispatch();


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
                if(response.data === true){
                    dispatch(currentUserSignIn({...currentUser, avatar: newAvatar}));
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
    }

    const changeUserName = (fields) => {
        setLoading(true);
        const newUserName = fields[0].value;
        if(newUserName === "") return;
        
        axios.patch("http://localhost:5000/userSettings/userName", 
        {userName: newUserName, isOauth: currentUser.isOauth}, 
        {withCredentials: true})  
            .then((response) => {
                console.log("response: ", response);
                if(response.data === true){
                    setLoading(false);
                    
                    setOpenUserNameDialog(false)
                    dispatch(currentUserSignIn({...currentUser, name: newUserName}));
                }
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
    }

    const verifyCode = (fields) => {
        const code = fields[0].value;

        if(code === "123abc"){
            setOpenVerifyCodeDialog(false);
            setOpenEmailPasswordDialog(true);
        } else {
            alert("Wrong code!");
        }
            
    }

    const changeEmailPassword = (fields) => {
        const newEmail = fields[0].value;
        const newPassword = fields[1].value;

        if(newEmail === "" || newPassword === "") return;

        axios.patch("http://localhost:5000/userSettings/emailAndPassword", 
        {email: newEmail, password: newPassword}, 
        {withCredentials: true})  
            .then((response) => {
                if(response.data === true){
                    setOpenEmailPasswordDialog(false);
                    logOut();
                }
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
        
    }

    const logOut = () => {
        history.push("/signin");
    }

    return(
        <div>
            <InfoNavbar/>
            <div className="user-info-page">
                {
                    openUserNameDialog 
                        ? <FormDialog 
                            title="Change User Name"
                            message="You may have to wait for a bit before the change can occur."
                            fields={[
                                {
                                    label: "User name",
                                    value: currentUser.name,
                                    type: "text"
                                }
                            ]}
                            action={changeUserName}
                            close={() => setOpenUserNameDialog(false)}
                        />
                    : null
                }

                {
                    openVerifyCodeDialog 
                        ? <FormDialog 
                            title="Verify your account"
                            message={"We have sent you an email to " + (currentUser.email) + ". Please write the code in the email down here to verify your account"}
                            fields={[
                                {
                                    label: "Verify code",
                                    value: "",
                                    type: "text"
                                }
                            ]}
                            action={verifyCode}
                            close={() => setOpenVerifyCodeDialog(false)}
                        />
                    : null
                }

                {
                    openEmailPasswordDialog 
                        ? <FormDialog 
                            title="Change your email and password"
                            message="Enter your new email/password under those fields below!"
                            fields={[
                                {
                                    label: "New Email",
                                    value: currentUser.email,
                                    type: "email"
                                },
                                {
                                    label: "New Password",
                                    value: "",
                                    type: "password"
                                }
                            ]}
                            action={changeEmailPassword}
                            close={() => setOpenEmailPasswordDialog(false)}
                        />
                    : null
                }
                
                {loading ? <LinearProgress color="secondary" /> : null}
                <UserInfoCard 
                    imageAction={changeAvatar}
                    startLoading={() => setLoading(true)} 
                    stopLoading={() => setLoading(false)} 
                    openFormDialog={() => setOpenUserNameDialog(true)}
                />
                <ChangeEmailPasswordJumboTron onClick={() => {setOpenVerifyCodeDialog(true)}}/>
            </div>
        </div>
        
    )
}


export default UserInfoPage;