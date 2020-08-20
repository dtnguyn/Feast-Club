import React, { useState } from "react";

import MainPageContent from "./MainPageContent"

import {currentUserSignIn, signIn } from "../../actions";
import { useDispatch } from "react-redux"

import axios from "axios";
import { BrowserRouter as Router, Route, Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux"


import "../../styles/Map.css";




function MainPage(props) {

  const dispatch = useDispatch();

  axios.get("http://localhost:5000/auth", {withCredentials: true})
      .then((response) => {
        const apiResponse = response.data
        if(apiResponse.status){
          dispatch(currentUserSignIn(response.data.data));
          dispatch(signIn());
        }      
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