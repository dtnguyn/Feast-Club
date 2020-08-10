import React, {useState, useEffect} from 'react';
import InfoNavbar from "../SharedComponents/InfoNavbar"
import UserInfoCard from "./UserInfoCard"
import ChangeEmailPasswordJumboTron from "./ChangeEmailPasswordJumbotron"
import LinearProgress from '@material-ui/core/LinearProgress';
import { useSelector } from "react-redux"
import axios from 'axios'
import FormDialog from "../SharedComponents/FormDialog"
import {currentUserSignIn } from "../../actions";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import TabView from './TabView';
import ComposeDialog from '../ExplorePage/ComposeDialog'
import ConfirmDialog from '../SharedComponents/ConfirmDialog'
import Footer from '../SharedComponents/Footer'


import "../../styles/UserInfoPage.css";
import "../../styles/Shared.css";

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

    
    
    if(!isLoggedIn){
        history.push("/signin"); 
    }

    const getVerificationEmail = () => {
        console.log("Click")
        axios.get("http://localhost:5000/verify", {withCredentials: true})
            .then((response) => {
                if(response.data === true){
                    setOpenVerifyCodeDialog(true)
                }
            })
    }

    const verifyCode = (fields) => {
        setLoading(true)
        const code = fields[0].value;
        console.log(code)
        if (code == "") return
        
        axios.post("http://localhost:5000/verify", {code}, {withCredentials: true})
            .then((response) => {
                setLoading(false)
                if(response.data === true){
                    setOpenVerifyCodeDialog(false);
                    setOpenEmailPasswordDialog(true);
                } else alert("The code is either wrong or expired!");
            })
    }


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

    const deleteBlog = (blogID) => {
        axios.delete("http://localhost:5000/blogPosts", {
            withCredentials: true,
            params: { 
                blogID
            } 
        })
            .then(response => {
                if(response.data){
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

        axios.patch("http://localhost:5000/blogPosts", formData,{
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
                if(response.data){
                    console.log("Successfully edit a blogpost!");
                    resetFocusBlog();
                    getUserBlogs();
                    setOpenCompose(false);
                    callback(true);
                }
                    
            })
    }



    const logOut = () => {
        history.push("/signin");
    }

    const getUserBlogs = () => {
        axios.get("http://localhost:5000/userblogs", 
        {withCredentials: true})  
            .then((response) => {
                if(response.data){
                    setBlogs(response.data);
                    console.log(response.data);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        getUserBlogs()
    }, [])

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
                    startLoading={() => setLoading(true)} 
                    stopLoading={() => setLoading(false)} 
                    openFormDialog={() => setOpenUserNameDialog(true)}
                />
                
                {currentUser.isOauth 
                ? null
                : <ChangeEmailPasswordJumboTron onClick={() => {getVerificationEmail()}}/>}
                
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