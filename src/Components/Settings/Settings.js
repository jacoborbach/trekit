import axios from 'axios';
import React from 'react'
import { connect } from 'react-redux'
import { clearUser, getUser } from '../../dux/reducer'
import { dark } from '../MyMap/ColorThemes/dark'
import { silver } from '../MyMap/ColorThemes/silver'
import { noLabels } from '../MyMap/ColorThemes/noLabels'
import './Settings.css'


function Settings(props) {
    const [toggleColor, changeToggle] = React.useState('')

    const handleLogout = () => {
        axios.get('/api/logout')
            .then(() => {
                props.history.push('/')
                props.clearUser()
            })
            .catch(err => console.log(err))
    }
    console.log(props)
    // const toggle = () => {
    //     changeToggle(!toggleColor)
    // }

    return (
        <div className='settings'>
            <div id='innerDiv'>

                <h4 id='colorHeader'>Color</h4>
                <p >Choose one of the following color themes:</p>

                <button onClick={e => {
                    changeToggle(e.target.innerText)
                    props.getUser({ ...props.user, theme: noLabels })
                }}>No Labels</button>
                <button onClick={e => {
                    changeToggle(e.target.innerText)
                    props.getUser({ ...props.user, theme: dark })
                }}>Dark</button>
                <button onClick={e => {
                    changeToggle(e.target.innerText)
                    props.getUser({ ...props.user, theme: silver })
                }}>Silver</button>
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
