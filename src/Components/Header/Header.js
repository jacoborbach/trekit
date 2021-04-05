import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { withRouter, Link } from 'react-router-dom'
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import './Header.css'

function Header(props) {
    const [textVal, settextVal] = useState('')
    const [searchResults, setsearchResults] = useState([])

    let handleChange = (e) => {
        settextVal(e.target.value)
    }

    useEffect(() => {
        if (textVal) {
            handleSearch()
        }
    }, [textVal])

    let handleSearch = async () => {
        await axios.get(`/api/friends/${textVal}`)
            .then(res => setsearchResults(res.data))
            .catch(err => console.log(err))
    }

    return (
        <>
            {props.location.pathname === '/' ? (

                <header className='header-container'>
                    <h1 id='logo'>trekit!</h1>
                </header>
            ) : (
                <header className='header-container2'>
                    <Link to='/myMap' className='nav-links' id='logo'><h1>trekit!</h1></Link>
                    {/* <input type='text' placeholder='Yoo Friends...' value={textVal} onChange={handleChange} /> */}
                    <div>
                        <Combobox>
                            <ComboboxInput
                                value={textVal}
                                onChange={handleChange}
                                placeholder="Search for Friends..."
                            />
                            <ComboboxPopover>
                                <ComboboxList>
                                    {searchResults.map((person, i) =>
                                        <ComboboxOption key={i} value={person.first_name} />
                                    )}
                                </ComboboxList>
                            </ComboboxPopover>
                        </Combobox>
                    </div>

                    <nav >
                        <Link to='/myMap' className='nav-links'>Map</Link>
                        <Link to='settings' className='nav-links'>
                            <span id="settings" role="img" aria-label="settingsLbl" title='Settings'>
                                ⚙️</span>{" "}
                        </Link>
                    </nav>
                </header>

            )}
        </>
    )
}

export default withRouter(Header)