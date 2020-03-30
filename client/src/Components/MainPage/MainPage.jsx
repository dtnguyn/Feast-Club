import React, { useState } from "react";

import Map from "./Map"
import FormDialog from "../SharedComponents/FormDialog"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

import '../../styles/Register.css';

import axios from "axios";
import { BrowserRouter as Router, Route, Link, useHistory } from "react-router-dom";

function MainPage() {

  const history = useHistory();


  axios.get("http://localhost:5000/", {withCredentials: true})
      .then((response) => {
            const logInStatus = response.data.logInStatus;
            console.log("logged in: " + logInStatus);
            if(logInStatus)
                console.log("Already signed in");
            else
                history.push("/");
      })
      .catch(err => {
          console.log(err);
      })

  return (
    <div>
      
      <FormDialog/>
    </div>
  );
}

export default MainPage;