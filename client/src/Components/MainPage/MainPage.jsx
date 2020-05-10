import React, { useState } from "react";

import MainPageContent from "./MainPageContent"
import FormDialog from "./LocationInfoForm"
import WindowInfo from "./WindowInfo"


import axios from "axios";
import { BrowserRouter as Router, Route, Link, useHistory } from "react-router-dom";
import { updateCurrentLocation } from "../../actions";
import { useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

import "../../styles/Map.css";




function MainPage(props) {

  const history = useHistory();
  const isLoggedIn = useSelector(state => state.isLoggedIn)
  

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
    <div className="map-container">
      <MainPageContent />
    </div>
  );
}

export default MainPage;