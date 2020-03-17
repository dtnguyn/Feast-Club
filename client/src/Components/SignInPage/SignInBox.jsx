import React, { useState } from "react";
import {Link} from "react-router-dom"

import '../../styles/SignIn.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'

import axios from "axios";

function SignInBox(){

    const [logInUser, setLogInUser] = useState({
        email: "",
        password: ""
    })

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
        
        console.log(logInUser);

        axios.post("http://localhost:5000/signin/signinResult", logInUser)
            .then(() => console.log('User Created'))
            .catch(err => {
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
            </div>
            <div>
                <FontAwesomeIcon className="brand-icon google" icon={faGoogle}/>
                <FontAwesomeIcon className="brand-icon facebook" icon={faFacebook}/>
            </div>
            
        </div>
        
    );
}

export default SignInBox;