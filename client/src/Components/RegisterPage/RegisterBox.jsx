import React, { useState } from "react";

import {Link} from "react-router-dom";

import '../../styles/Register.css';

import axios from "axios";


function RegisterBox(){

    const [newUser, setNewUser] = useState({
        name: "", 
        email: "",
        password: "",
        passwordCheck: ""
    })


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

        const user = {
            name: newUser.name,
            email: newUser.email,
            password: newUser.passwordCheck
        }

        axios.post("http://localhost:5000/register/add", user)
            .then(() => console.log('User Created'))
            .catch(err => {
                console.log(err);
        })
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
        </div>
        
    );
}





export default RegisterBox;
