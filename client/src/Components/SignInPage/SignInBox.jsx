import React, { useState, useEffect } from "react";
import {Link, Redirect, useHistory} from "react-router-dom"

import '../../styles/SignIn.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'

import AlertDialog from '../SharedComponents/AlertDialog'

import { signIn, currentUserSignIn, updateCurrentLocation } from "../../actions";
import { useDispatch } from "react-redux"

import FormDialog from "../SharedComponents/FormDialog"
import axios from "axios";

function SignInBox(){

    axios.create({ withCredentials: true})

    const [logInStatus, setLogInStatus] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [message, setMessage] = useState("");

    const [emailVerification, setEmailVerification] = useState("")
    const [idVerification, setIdVerification] = useState("")
    const [emailVerifyDialog, setEmailVerifyDialog] = useState(false)
    const [verifyDialog, setVerifyDialog] = useState(false);
    const [passwordDialog, setPasswordDialog] = useState(false);


    const dispatch = useDispatch();

    const successRoute = "/mainPage"
    const failRoute = "/error"
    const history = useHistory();

    const [logInUser, setLogInUser] = useState({
        email: "",
        password: ""
    })

    function closeDialog(){
        setDialog(false);
    }

    function handleChange(event){
        const { name, value } = event.target;
        setLogInUser(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }
            
        });
        console.log(logInUser);
    }


    function handleSignInButton(event){

        event.preventDefault();

    
        axios.post("http://localhost:5000/auth/signin", logInUser, {withCredentials: true})
            .then((response) => {
                const logInStatus = response.data.status;
                const messageSendBack = response.data.message;
                if(logInStatus){
                    console.log(response.data.data);
                    dispatch(signIn());
                    dispatch(currentUserSignIn(response.data.data));
                    history.push("/");
                } else{
                    setMessage(messageSendBack);
                    setDialog(true);
                }
            })
            .catch(err => {
                console.log(err);

            })

    
    }

    function verifyEmail(fields){
        const email = fields[0].value;
        if (email == "") return
        axios.post("http://localhost:5000/auth/verify/email", {email})
            .then((response) => {
                setEmailVerifyDialog(false);
                const status = response.data.status
                const user = response.data.data
                if(status) {
                    setEmailVerification(email)
                    setIdVerification(user.id)
                    getVerificationEmail(user.email, user.id)
                } else {
                    alert(response.data.message)
                }

            })
    }

    const getVerificationEmail = (email, id) => {
        console.log("Click")
        axios.get("http://localhost:5000/auth/verify", {
            params: {
                email,
                id
            }
        })
            .then((response) => {
                const apiResponse = response.data
                if(apiResponse.status){
                    setVerifyDialog(true)
                } else if(apiResponse.code == 401){
                    history.push("/signin")
                } else {
                    alert(apiResponse.message)
                }
            })
    }

    const verifyCode = (fields) => {
        const code = fields[0].value;
        console.log(code)
        if (code == "") return
        
        axios.post("http://localhost:5000/auth/verify", {code, id: idVerification})
            .then((response) => {
                const apiResponse = response.data
                if(apiResponse.status){
                    setVerifyDialog(false);
                    setPasswordDialog(true);
                } else {
                    alert(apiResponse.message)
                }
            })
    }

    const changeEmailPassword = (fields) => {
        const newEmail = fields[0].value;
        const newPassword = fields[1].value;

        if(newEmail === "" || newPassword === "") return;

        axios.patch("http://localhost:5000/user/edit/emailAndPassword", 
        {email: newEmail, password: newPassword, id: idVerification})  
            .then((response) => {
                const apiResponse = response.data
                setPasswordDialog(false);
                alert(apiResponse.message)
            })
            .catch((err) => {
                console.log(err);
            })
        
    }


    const redirectLinkStyle = {
        color: '#eb8242'
    }


    

    return(
        <div>
            <div className="form-sign-in">
                <h3>Sign in</h3>
                <form>
                    <div>
                        <label className="sign-in-label">Your email</label>
                        <input name="email" type="text" className="input-sign-in" placeholder="Enter your email..." value={logInUser.email} onChange={handleChange}/>
                        <div className="line-box">
                        <div className="line"></div>
                        </div>
                    </div>
                    <div>
                        <label className="sign-in-label">Your password</label>
                        <input name="password" type="password" className="input-sign-in" placeholder="Enter your password..." value={logInUser.password} onChange={handleChange}/>
                        <div className="line-box">
                        <div className="line"></div>
                        </div>
                    </div>
                </form>
                <button type="button" class="btn btn-warning btn-circle btn-lg" onClick={handleSignInButton}>Sign in</button>
                <Link style={redirectLinkStyle} to="/register"><p className="register-redirect">Don't have an acccount? Register for free!</p></Link>
                <Link style={redirectLinkStyle} onClick={() => setEmailVerifyDialog(true)}><p className="register-redirect">Forgot password?</p></Link>
            </div>
            <div>
                <a href="http://localhost:5000/auth/google">
                    <FontAwesomeIcon className="brand-icon google" icon={faGoogle}/>
                </a>
                <a href="http://localhost:5000/auth/facebook">
                    <FontAwesomeIcon className="brand-icon facebook" icon={faFacebook}/>
                </a>
            </div>

            <AlertDialog
                open={dialog}
                close={closeDialog}
                alertTitle="Cannot sign in!"
                alertMessage={message}
            />

            {
                emailVerifyDialog 
                    ? <FormDialog 
                        title="Email verification."
                        message={"Please enter the email of your account"}
                        fields={[
                            {
                                label: "Email",
                                value: "",
                                type: "email"
                            }
                        ]}
                        action={verifyEmail}
                        close={() => setEmailVerifyDialog(false)}
                    />
                : null
            }

            {
                verifyDialog 
                    ? <FormDialog 
                        title="Verify your account"
                        message={"We have sent you an email to " + (emailVerification) + ". Please write the code in the email down here to verify your account"}
                        fields={[
                            {
                                label: "Verify code",
                                value: "",
                                type: "text"
                            }
                        ]}
                        action={verifyCode}
                        close={() => setVerifyDialog(false)}
                    />
                : null
            }

            {
                    passwordDialog 
                        ? <FormDialog 
                            title="Change your email and password"
                            message="Enter your new email/password under those fields below!"
                            fields={[
                                {
                                    label: "New Email",
                                    value: emailVerification,
                                    type: "email"
                                },
                                {
                                    label: "New Password",
                                    value: "",
                                    type: "password"
                                }
                            ]}
                            action={changeEmailPassword}
                            close={() => setPasswordDialog(false)}
                        />
                    : null
                }
            
        </div>
        
    );
}

export default SignInBox;