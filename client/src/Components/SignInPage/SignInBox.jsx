import React, { useState } from "react";
import {Link, Redirect, useHistory} from "react-router-dom"

import '../../styles/SignIn.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'

import AlertDialog from '../SharedComponents/AlertDialog'

import { signIn } from "../../actions";
import { useDispatch } from "react-redux"

import axios from "axios";

function SignInBox(){

    axios.create({ withCredentials: true})

    const [logInStatus, setLogInStatus] = useState(false)
    const [dialog, setDialog] = useState(false);
    const [message, setMessage] = useState("");

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

    
        axios.post("http://localhost:5000/signin", logInUser, {withCredentials: true})
            .then((response) => {
                const logInStatus = response.data.logInStatus;
                const messageSendBack = response.data.message;
                // const mainPageData = {
                //     location: response.data.provideLocation,
                //     nearbyRestaurants: response.data.nearbyRestaurants
                // }
                // console.log(mainPageData);
                if(logInStatus){
                    dispatch(signIn());
                    history.push("/mainPage");
                } else{
                    setMessage(messageSendBack);
                    setDialog(true);
                }
            })
            .catch(err => {
                console.log(err);

            })

    
    }

    // function isValid(email, password){

    //     //Check blank input
    //     if(name, email, password, passwordCheck === "") {
    //         console.log("is false")
    //         setMessage( "You have left some blank fields!");
    //         return false
    //     }

    //     //Check if email is valid
    //     if(!validator.validate(email)){
    //         setMessage( "Your email is invalid!");
    //         return false
    //     }

    //     //Check if password and retype password is the same 
    //     if(password != passwordCheck){
    //         setMessage("Check your password again!");
    //         return false
    //     }

    //     return isValid;
    // }


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
            
        </div>
        
    );
}

export default SignInBox;