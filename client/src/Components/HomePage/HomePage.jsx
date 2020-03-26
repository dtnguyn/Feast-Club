import React, { useState } from "react";
import {Link, Redirect, useHistory} from "react-router-dom"

import axios from "axios";

function HomePage(){
    const history = useHistory();

    axios.get("http://localhost:5000/", {withCredentials: true})
      .then((response) => {
            const logInStatus = response.data.logInStatus;
            const id = response.data.id;
            if(logInStatus){
                history.push("/users/id:" + id);
            }
      })
      .catch(err => {
          console.log(err);

      })



    return(
        <div> <h1>HomePage</h1></div>
    )
}

export default HomePage