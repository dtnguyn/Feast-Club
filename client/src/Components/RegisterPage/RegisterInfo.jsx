import React, { useState } from "react";
import '../../styles/Register.css';
import SearchBar from "./SearchBar"
import FeaturesList from "./FeaturesList"

function RegisterInfo(){
    return(
        <div className="register-info-box">
            <h1>Feast</h1>
            <h2> club</h2>
            <SearchBar/>
            <FeaturesList/>
        </div>
    );
}

export default RegisterInfo;
