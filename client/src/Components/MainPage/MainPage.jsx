import React, { useState } from "react";

import MainPageContent from "./MainPageContent"

import {currentUserSignIn } from "../../actions";
import { useDispatch } from "react-redux"

import axios from "axios";
import { BrowserRouter as Router, Route, Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux"


import "../../styles/Map.css";




function MainPage(props) {

  const history = useHistory();
  const isLoggedIn = useSelector(state => state.isLoggedIn)
  const dispatch = useDispatch();

  axios.get("http://localhost:5000/", {withCredentials: true})
      .then((response) => {
            const logInStatus = response.data.logInStatus;
            console.log("logged in: " + logInStatus);
            if(logInStatus){
              console.log("Authenticate from session");
            }
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