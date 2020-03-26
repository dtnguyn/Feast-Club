import React, { useState } from "react";

import RegisterInfo from "./RegisterInfo";
import RegisterBox from "./RegisterBox";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import GoogleLogin from 'react-google-login';

import '../../styles/Register.css';

import axios from "axios";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function RegisterPage() {

  function handleRegister(){
    console.log("clicked");
    axios.get("http://localhost:5000/auth/google")
      .then((response) => {
            // const logInStatus = response.data.logInStatus;
            // const id = response.data.id;
            // if(logInStatus){
            //     history.push("/users/id:" + id);
            // }
      })
      .catch(err => {
          console.log(err);

      })
  }

  const responseGoogle = (response) => {
    console.log(response);
  }

  

  return (
    <div className="register-layout row">
      <div className="col-md-6 col-sm-12">
        <RegisterInfo/>
      </div>
      <div className="col-md-4 col-sm-12">
        <RegisterBox/>
      </div>
      <div className="col-md-2 col-sm-12 brand-icon-container"> 
        <FontAwesomeIcon onClick={handleRegister} className="brand-icon-register google" icon={faGoogle}/>
        <FontAwesomeIcon className="brand-icon-register facebook" icon={faFacebook}/>
      </div>
      <button>testApi</button>
    </div>
  );
}

export default RegisterPage;