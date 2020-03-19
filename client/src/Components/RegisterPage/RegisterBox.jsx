import React, { useState } from "react";

import {Link, useHistory} from "react-router-dom";
import AlertDialog from "../SharedComponents/AlertDialog"

import '../../styles/Register.css';

import axios from "axios";


function RegisterBox(){

    const validator = require("email-validator");

    const history = useHistory();

    const [newUser, setNewUser] = useState({
        name: "", 
        email: "",
        password: "",
        passwordCheck: ""
    })

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const openDialog = () => {
        setOpen(true);
      };
    
    const closeDialog = () => {
    setOpen(false);
    };
    

    function handleChange(event){
        const { name, value } = event.target;
        setNewUser(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }
            
        });
        console.log(newUser);
    }
    
    function handleRegisterButton(event){
        event.preventDefault();
        
        console.log(newUser);

        if(isValid(newUser.name, newUser.email, newUser.password, newUser.passwordCheck)){
            const user = {
                name: newUser.name,
                email: newUser.email,
                password: newUser.passwordCheck
            }

            axios.post("http://localhost:5000/register/add", user)
                .then(response => {
                    console.log('User Created');
                    const registerStatus = response.data.logInStatus;
                    if(registerStatus){
                        history.push("/register/status", registerStatus);
                    } else {
                        console.log('Duplicated');
                        setMessage(response.data.message);
                        openDialog();
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            setOpen(true);
        }
    }

    function isValid(name, email, password, passwordCheck){
        //Check blank input
        if(name, email, password, passwordCheck === "") {
            console.log("is false")
            setMessage( "You have left some blank fields!");
            return false
        }

        //Check if email is valid
        if(!validator.validate(email)){
            setMessage( "Your email is invalid!");
            return false
        }

        //Check if password and retype password is the same 
        if(password != passwordCheck){
            setMessage("Check your password again!");
            return false
        }

        return isValid;
    }

    const redirectLinkStyle = {
        color: '#eb8242'
    }

    return(
        <div className="right-page">
            <div className="form-register">
                <h3>Register</h3>
                <form>
                    <div>
                        <label className="register-label">Your name</label>
                        <input name="name" type="text" className="input-register" placeholder="Enter your name..." onChange={handleChange} value={newUser.name}/>
                        <div className="line-box">
                        <div className="line"></div>
                        </div>
                    </div>
                    <div>
                        <label className="register-label">Your email</label>
                        <input name="email" type="email" className="input-register" placeholder="Enter your email..." onChange={handleChange} value={newUser.email}/>
                        <div className="line-box">
                        <div className="line"></div>
                        </div>
                    </div>
                    <div>
                        <label className="register-label">Your password</label>
                        <input  name="password" type="password" className="input-register" placeholder="Enter your password..." onChange={handleChange} value={newUser.password} />
                        <div className="line-box">
                        <div className="line"></div>
                        </div>
                        <input name="passwordCheck" type="password" className="input-register" placeholder="Retype your password..." onChange={handleChange} value={newUser.passwordCheck}/>
                        <div className="line-box">
                        <div className="line"></div>
                        </div>
                    </div>
                </form>
                <button type="button" class="btn btn-warning btn-circle btn-lg" onClick={handleRegisterButton}>Register</button>
                <Link style={redirectLinkStyle} to="/signin"><p className="sign-in-redirect">Already have an account? Sign in</p></Link>
            </div>
            <AlertDialog
                open={open}
                close={closeDialog}
                alerMessage={message}
            />
        </div>
        
    );
}





export default RegisterBox;
