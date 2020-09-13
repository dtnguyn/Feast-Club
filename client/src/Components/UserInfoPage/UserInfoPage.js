import React, {useState, useEffect} from 'react';
import InfoNavbar from "../SharedComponents/InfoNavbar"
import UserInfoCard from "./UserInfoCard"
import ChangeEmailPasswordJumboTron from "./ChangeEmailPasswordJumbotron"
import LinearProgress from '@material-ui/core/LinearProgress';
import { useSelector } from "react-redux"
import axios from 'axios'
import FormDialog from "../SharedComponents/FormDialog"
import { useHistory } from 'react-router-dom';
import TabView from './TabView';
import ComposeDialog from '../ExplorePage/ComposeDialog'
import ConfirmDialog from '../SharedComponents/ConfirmDialog'
import Footer from '../SharedComponents/Footer'
import {currentUserSignIn, signOut, signIn } from "../../actions";
import { useDispatch } from "react-redux"

import "../../styles/UserInfoPage.css";
import "../../styles/Shared.css";
import AlertDialog from '../SharedComponents/AlertDialog';

const UserInfoPage = () => {

    const [loading, setLoading] = useState(false);

    const [openUserNameDialog, setOpenUserNameDialog] = useState(false);
    const [openVerifyCodeDialog, setOpenVerifyCodeDialog] = useState(false);
    const [openEmailPasswordDialog, setOpenEmailPasswordDialog] = useState(false);
    const [blogs, setBlogs] = useState({
        userBlogs: [],
        likedBlogs: []
    });

    const [openCompose, setOpenCompose] = useState(false);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const [focusBlog, setFocusBlog] = useState({
        blogID: '',
        restaurant: '',
        blogContent: '',
        images: []
    })

    const [loginDialog, setLoginDialog] = useState(false);

    
    const history = useHistory();
    const isLoggedIn = useSelector(state => state.isLoggedIn)
    const currentUser = useSelector(state => state.currentUser);
    
    const dispatch = useDispatch();


    const resetFocusBlog = () => {
        setFocusBlog({
            blogID: '',
            restaurant: '',
            blogContent: '',
            images:[]
        })
    }



    const getVerificationEmail = (email, id) => {
        console.log("Click")
        axios.get("http://localhost:5000/auth/verify",{
            params:{
                email,
                id
            }
        })
            .then((response) => {
                const apiResponse = response.data
                if(apiResponse.status){
                    setOpenVerifyCodeDialog(true)
                } else if(apiResponse.code == 401){
                    history.push("/signin")
                } else {
                    alert(apiResponse.message)
                }
            })
    }

    const verifyCode = (fields) => {
        setLoading(true)
        const code = fields[0].value;
        console.log(code)
        if (code == "") return
        
        axios.post("http://localhost:5000/auth/verify", {code, id: currentUser.id}, {withCredentials: true})
            .then((response) => {
                setLoading(false)
                const apiResponse = response.data
                if(apiResponse.status){
                    setOpenVerifyCodeDialog(false);
                    setOpenEmailPasswordDialog(true);
                } else if(apiResponse.code == 401){
                    history.push("/signin")
                    setLoginDialog(true)
                } else {
                    alert(apiResponse.message)
                }
            })
    }


    const changeAvatar = (newAvatar) => {
        setLoading(true);
        var formData = new FormData();
        formData.append('image', newAvatar)
        console.log("Change avatar!", formData, newAvatar)
        axios.patch("http://localhost:5000/user/edit/avatar", formData, {
            params: {
                id: currentUser.id,
                isOauth: currentUser.isOauth
            },
            withCredentials: true
        })  
            .then((response) => {
                const apiResponse = response.data
                if(apiResponse.status){
                    dispatch(currentUserSignIn({...currentUser, avatar: newAvatar}));
                    setLoading(false);
                } else if(apiResponse.code == 401){
                    history.push("/signin")
                    setLoginDialog(true)
                } else {
                    alert(apiResponse.message)
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
        
        axios.patch("http://localhost:5000/user/edit/userName", 
        {userName: newUserName, isOauth: currentUser.isOauth}, 
        {withCredentials: true})  
            .then((response) => {
                setLoading(false);
                const apiResponse = response.data
                if(apiResponse.status){
                    setOpenUserNameDialog(false)
                    dispatch(currentUserSignIn({...currentUser, name: newUserName}));
                } else if(apiResponse.code == 401){
                    history.push("/signin")
                    setLoginDialog(true)
                } else {
                    alert(apiResponse.message)
                }
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
    }

    

    const changeEmailPassword = (fields) => {
        const newEmail = fields[0].value;
        const newPassword = fields[1].value;

        if(newEmail === "" || newPassword === "") return;

        axios.patch("http://localhost:5000/user/edit/emailAndPassword", 
        {email: newEmail, password: newPassword, id: currentUser.id}, 
        {withCredentials: true})  
            .then((response) => {
                const apiResponse = response.data
                if(apiResponse.status){
                    setOpenEmailPasswordDialog(false);
                    logOut();
                } else if(apiResponse.code == 401){
                    history.push("/signin")
                    setLoginDialog(true)
                } else {
                    alert(apiResponse.message)
                }
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
        
    }


    const deleteBlog = (blogID) => {
        axios.delete("http://localhost:5000/blogs", {
                withCredentials: true,
                params: { 
                    blogID
                } 
            })
            .then(response => {
                const apiResponse = response.data
                if(apiResponse.status){
                    console.log("Successfully delete a blogpost!");
                    resetFocusBlog();
                    getUserBlogs();
                }
                    
            })
    }


    const editBlog = (restaurant, blogContent, files, callback) => {
        
        var formData = new FormData();
        for (const key of Object.keys(files)) {
            formData.append('imgCollection', files[key])
        }  

        axios.patch("http://localhost:5000/blogs/", formData,{
            withCredentials: true,
            params: {
                blogID: focusBlog.blogID,
                restaurantID: restaurant.id,
                restaurantName: restaurant.name,
                restaurantAddress: restaurant.address,
                city: restaurant.city,
                country: restaurant.country,
                blogContent
            }
        })
            .then(response => {
                const apiResponse = response.data
                if(apiResponse.status){
                    console.log("Successfully edit a blogpost!");
                    resetFocusBlog();
                    getUserBlogs();
                    setOpenCompose(false);
                    callback(true);
                }
                    
            })
    }



    const logOut = () => {
        setLoading(true)
        axios.get("http://localhost:5000/auth/logout", {withCredentials: true})  
            .then((response) => {
                setLoading(false)
                const apiResponse = response.data
                if(apiResponse.status){
                    console.log("Log out successfully");
                    dispatch(signOut());
                    history.push("/signin");
                } else {
                    alert("Can't log out.")
                }
            })
            .catch((err) => {
                setLoading(false)
                alert(err)
                console.log(err);
            })
        
        
    }

    const getUserBlogs = () => {
        axios.get("http://localhost:5000/blogs/user", 
        {withCredentials: true})  
            .then((response) => {
                const apiResponse = response.data
                if(apiResponse.status){
                    setBlogs(apiResponse.data);
                    console.log(apiResponse.data);
                } else if(apiResponse.code == 401) {
                    // history.push("/signin")
                    setLoginDialog(true)
                } else {
                    alert(apiResponse.message)
                }
        
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const checkAuthentication = () => {
        axios.get("http://localhost:5000/auth/",
        {withCredentials: true})
            .then((response) => {
                const apiResponse = response.data;
                if(apiResponse.status){
                    dispatch(signIn());
                } else {
                    logOut();
                }
            })
    }

    useEffect(() => {
        checkAuthentication();
        getUserBlogs()
    }, [])

    if(!isLoggedIn){
        return(
            <AlertDialog
                open={loginDialog}
                alertTitle="Login first!"
                alertMessage="We are moving you to login page!"
                close={()=>{
                        setLoginDialog(false)
                        history.push("/signin")
                    }
                }
            />
        )
    }

    return(
        <div className="page">
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
                    postCount={blogs.userBlogs.length}
                    logOut={logOut}
                    startLoading={() => setLoading(true)} 
                    stopLoading={() => setLoading(false)} 
                    openFormDialog={() => setOpenUserNameDialog(true)}
                />
                
                {currentUser.isOauth 
                ? null
                : <ChangeEmailPasswordJumboTron onClick={() => {getVerificationEmail(currentUser.email, currentUser.id)}}/>}
                
                <div className="tab-view-container">
                    <TabView
                        blogs={blogs}
                        focusBlog={focusBlog}
                        setFocusBlog={setFocusBlog}
                        resetFocusBlog={resetFocusBlog}
                        setOpenCompose={setOpenCompose}
                        setDeleteDialog={setDeleteDialog}
                    />
                </div>
                <ComposeDialog 
                    open={openCompose} 
                    handleClose={() => {
                        setOpenCompose(false);
                        resetFocusBlog();
                    }} 
                    focusBlog={focusBlog}
                    handleEdit={editBlog}
                />
                <ConfirmDialog 
                    open={deleteDialog} 
                    close={() => setDeleteDialog(false)} 
                    message="Do you want to delete this post?"
                    confirmedAction={() => deleteBlog(focusBlog.blogID)}
                />
            </div>
            <Footer/>
        </div>
        
    )
}


export default UserInfoPage;