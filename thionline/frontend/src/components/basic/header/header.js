import React from 'react';
import './header.css'; 
import logo from './logo.jpg';

function HomepageHeader(props) {
    return (
        <div>
            <div className="header-container-2">
                <img src={logo} alt="logo" className="logo" />
            </div>
        </div>
    );
}

export default HomepageHeader;