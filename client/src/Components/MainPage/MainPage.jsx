import React, { useState } from "react";

import MainPageContent from "./MainPageContent"

import {currentUserSignIn, signIn } from "../../actions";
import { useDispatch } from "react-redux"

import axios from "axios";
import { BrowserRouter as Router, Route, Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux"


import "../../styles/Map.css";




function MainPage(props) {

  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();

  // axios.get("http://localhost:5000/auth", {withCredentials: true})
  //     .then((response) => {
  //           const logInStatus = response.data.status;
  //           console.log("logged in: " + logInStatus);
  //           if(logInStatus){
  //             console.log("Authenticate from session");
  //             setIsLoggedIn(true);
  //             dispatch(currentUserSignIn(response.data.data));
  //             dispatch(signIn());
  //           }
  //           else
  //             history.push("/");        
  //     })
  //     .catch(err => {
  //         console.log(err);
  //     })

  // if(!isLoggedIn) return null

  return (
    <div className="map-container">
      <MainPageContent />
    </div>
  );
}

export default MainPage;