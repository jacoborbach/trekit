import axios from 'axios';
import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { clearUser, getUser } from '../../dux/reducer'
import './Settings.css'

import { ThemeProvider } from 'styled-components';
import { useOnClickOutside } from '../../hooks';
import { GlobalStyles } from '../../global';
import { theme } from '../../theme';
import { Burger, Menu } from '../../Components';
import FocusLock from 'react-focus-lock';

import useWindowDimensions from '../../useWindowDimensions'


function Settings(props) {
    const { device, orientation } = useWindowDimensions();
    const [open, setOpen] = useState(false);
    const node = useRef();
    const menuId = "main-menu";

    useOnClickOutside(node, () => setOpen(false));

    const [toggleColor, changeToggle] = React.useState('')

    const handleLogout = () => {
        axios.get('/api/logout')
            .then(() => {
                props.history.push('/')
                props.clearUser()
            })
            .catch(err => console.log(err))
    }

    const handleColorChange = (e) => {
        changeToggle(e)
        axios.put('/api/changecolor', { id: props.user.id, color: e })
            .then(res =>
                props.getUser({ ...props.user, theme: res.data.theme })
            )
            .catch(err => console.log(err))
    }

    console.log(props)
    return (
        <div className='settings'>
            {/* device: {device} ~ orientation: {orientation} */}
            {device === 'smallMobile' && orientation === 'landscape' ? (
                <ThemeProvider theme={theme}>
                    <>
                        <GlobalStyles />
                        <div ref={node}>
                            <FocusLock disabled={!open}>
                                <Burger open={open} setOpen={setOpen} aria-controls={menuId} />
                                <Menu open={open} setOpen={setOpen} id={menuId} />
                            </FocusLock>
                        </div>
                    </>
                </ThemeProvider>
            ) : null}

            <div id='innerDiv'>
                <h3 id='colorHeader'>{props.user.first_name} {props.user.last_name}</h3>
                <h4 id='colorHeader'>Map</h4>
                <p >Choose one of the following color themes:</p>

                <button onClick={e => {
                    handleColorChange(e.target.innerText)
                }}>Original</button>
                <button onClick={e => {
                    handleColorChange(e.target.innerText)
                }}>No Labels</button>
                <button onClick={e => {
                    handleColorChange(e.target.innerText)
                }}>Dark</button>
                <button onClick={e => {
                    handleColorChange(e.target.innerText)
                }}>Silver</button>
                <button onClick={e => {
                    handleColorChange(e.target.innerText)
                }}>Sunset</button>
                {toggleColor ? <div>Color Successfully Changed to {toggleColor}</div> : null}

            </div>


            <button onClick={handleLogout} id="logout">Logout</button>

        </div>
    )
}
const mapStateToProps = reduxState => ({
    user: reduxState.userReducer.user
})

export default connect(mapStateToProps, { clearUser, getUser })(Settings)
