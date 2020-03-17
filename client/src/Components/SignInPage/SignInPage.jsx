import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SignInBox from './SignInBox'




function SignInPage(){
    return(
        <div className="div-sign-in">
            <h1>Feast</h1>
            <h2> club</h2>
            <SignInBox/>
            
        </div>
    );
}

export default SignInPage;