import React from 'react';

import  '../../styles/Shared.css';
import {Navbar, Nav} from 'react-bootstrap';
import Logo from './Logo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeAsia } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faCompass } from '@fortawesome/free-solid-svg-icons';

function InfoNavbar(){
    return(
        <Navbar className="info-navbar">
            <Navbar.Brand >
                <Logo 
                    size="sm"
                />
            </Navbar.Brand>
            <div className="navbar-icon">
                    <FontAwesomeIcon className="window-info-icon" icon={faGlobeAsia}/>
                    <FontAwesomeIcon className="window-info-icon" icon={faUser}/>
                    <FontAwesomeIcon id="compass" className="window-info-icon" icon={faCompass}/>
                </div>
        </Navbar>
    );
}

export default InfoNavbar;