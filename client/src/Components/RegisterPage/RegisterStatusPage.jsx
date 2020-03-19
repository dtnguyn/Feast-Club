import React, { useState } from "react";

import Logo from "../SharedComponents/Logo"

import '../../styles/Register.css';

import axios from "axios";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function RegisterStatusPage(props) {

    const redirectLinkStyle = {
        color: '#eb8242'
    }

    const registerStatus = props.location.state;
    console.log(registerStatus);

    return (
        <div className="register-status-page">
            <Logo/>
            {registerStatus ? <h3>Regiter Successfully!</h3> : <h3>Register Failed! :(</h3>} 
            {registerStatus ? <Link style={redirectLinkStyle} to="/signin"><p className="sign-in-new-account-redirect"> Click here to sign in with your new account!</p> </Link>
                            : <Link style={redirectLinkStyle} to="/register"><p className="sign-in-new-account-redirect"> Click here to try again!</p> </Link>}
            
        </div>
    );
}

export default RegisterStatusPage;