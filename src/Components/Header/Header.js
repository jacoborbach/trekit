import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
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
import { setISODay } from 'date-fns';

function Header(props) {
    const [textVal, settextVal] = useState('')
    const [searchResults, setsearchResults] = useState([])
    const [first, setFirst] = useState('')
    const [last, setLast] = useState('')
    // const [id, setID] = useState(0)

    let handleChange = (e) => {
        settextVal(e.target.value)
    }

    useEffect(() => {
        // if (props.location.pathname.includes('friend')) {
        //     settextVal('')
        // }
        if (textVal) {
            handleSearch()
        }
    }, [textVal, last])

    let handleSearch = () => {
        axios.get(`/api/friends/${textVal}`)
            .then(res => setsearchResults(res.data))
            .catch(err => console.log(err))
    }

    let handleClick = (id) => {
        if (props.user.id === id) {
            settextVal('')
            props.history.push(`/myMap`)
        } else {
            settextVal('')
            props.history.push(`/friend/${id}`)
        }
    }

    console.log(props)

    return (
        <>
            {props.location.pathname === '/' ? (

                <header className='header-container'>
                    <h1 id='logo'>trekit!</h1>
                </header>
            ) : (
                <header className='header-container2'>
                    <Link to='/myMap' className='nav-links' id='logo'><h1>trekit!</h1></Link>
                    <div >
                        <Combobox >
                            <ComboboxInput
                                id="searchFriends"
                                value={textVal}
                                onChange={handleChange}
                                placeholder="  Search for Friends..."
                            />
                            <ComboboxPopover>
                                <ComboboxList>
                                    {searchResults.map(person =>
                                        <ComboboxOption key={person.id} value={person.first_name + ' ' + person.last_name} onClick={() => handleClick(person.id)} />
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

const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default withRouter(connect(mapStateToProps)(Header))