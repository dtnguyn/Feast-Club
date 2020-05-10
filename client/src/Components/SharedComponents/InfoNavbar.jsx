import React from 'react';

import  '../../styles/RestaurantInfoDetail.css';
import {Navbar, Nav} from 'react-bootstrap';
import Logo from './LogoSmall'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeAsia } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faCompass } from '@fortawesome/free-solid-svg-icons';

function InfoNavbar(){
    return(
        <Navbar className="info-navbar">
            <Navbar.Brand >
                <div className="navbar-icon">
                    <FontAwesomeIcon className="window-info-icon" icon={faGlobeAsia}/>
                    <FontAwesomeIcon className="window-info-icon" icon={faUser}/>
                    <FontAwesomeIcon id="compass" className="window-info-icon" icon={faCompass}/>
                </div>
                <Logo className="navbar-logo"/>
                
                
            </Navbar.Brand>
        </Navbar>
    );
}

export default InfoNavbar;