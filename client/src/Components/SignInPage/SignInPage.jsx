import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SignInBox from './SignInBox'
import Logo from '../SharedComponents/Logo'



function SignInPage(){
    return(
        <div className="div-sign-in">
            <Logo/>
            <SignInBox/>
            
        </div>
    );
}

export default SignInPage;