import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SignInBox from './SignInBox'
import Logo from '../SharedComponents/Logo'
import axios from 'axios'
import { useDispatch } from "react-redux";
import { signOut } from "../../actions";



function SignInPage(){
    const dispatch = useDispatch();
    useEffect(() => {
        axios.get("http://localhost:5000/logout", {withCredentials: true})  
            .then((response) => {
                if(response.data === true){
                    console.log("Log out successfully");
                    dispatch(signOut());
                }
            })
            .catch((err) => {
                console.log(err);
            })
    },[])
    return(
        <div className="div-sign-in">
            <Logo/>
            <SignInBox/>
        </div>
    );
}

export default SignInPage;