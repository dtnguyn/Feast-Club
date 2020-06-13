import React from 'react';
import { useHistory } from 'react-router-dom'
import  '../../styles/Shared.css';
import {Navbar, Nav} from 'react-bootstrap';
import Logo from './Logo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeAsia } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faMapMarked } from '@fortawesome/free-solid-svg-icons';

function InfoNavbar(){

    const history = useHistory()

    const changePage = (route) => {
        history.push(route)
    }

    return(
        <Navbar className="info-navbar">
            <Navbar.Brand >
                <Logo 
                    size="sm"
                />
            </Navbar.Brand>
            <div className="navbar-icon">
                    <FontAwesomeIcon className="window-info-icon" icon={faGlobeAsia} onClick={() => changePage("/explore")}/>
                    <FontAwesomeIcon className="window-info-icon" icon={faUser} onClick={() => changePage("/userinfo")}/>
                    <FontAwesomeIcon id="compass" className="window-info-icon" icon={faMapMarked} onClick={() => changePage("/mainpage")}/>
                </div>
        </Navbar>
    );
}

export default InfoNavbar;