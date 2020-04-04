import React, { useState } from "react";

import Map from "../Map/Map"
import FormDialog from "../Map/LocationInfoForm"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

import '../../styles/Register.css';

import axios from "axios";
import { BrowserRouter as Router, Route, Link, useHistory } from "react-router-dom";

function MainPage(props) {

  const history = useHistory();

  
  
  axios.get("http://localhost:5000/", {withCredentials: true})
      .then((response) => {
            const logInStatus = response.data.logInStatus;
            console.log("logged in: " + logInStatus);
            if(logInStatus)
              console.log("Authenticate from session"); 
            else
              history.push("/");
      })
      .catch(err => {
          console.log(err);
      })

  return (
    <div>
      <Map/>
    </div>
  );
}

export default MainPage;