import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import './Header.css'

function Header(props) {
    // console.log(props)
    return (
        <header className='header-container'>
            <Link to='/' className='nav-links' id='logo'><h1>Trekit</h1></Link>
            {props.location.pathname !== '/'
                ? (
                    <nav>
                        <Link to='/myMap' className='nav-links'>Map</Link>
                        <Link to='settings' className='nav-links'><span id="settings" role="img" aria-label="settingsLbl" title='Settings'>
                            ⚙️
                    </span>{" "}</Link>
                    </nav>
                )
                : null
            }
        </header >
    )
}

export default withRouter(Header)