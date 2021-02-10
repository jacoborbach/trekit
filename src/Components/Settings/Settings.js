import axios from 'axios';
import React from 'react'
import { connect } from 'react-redux'
import { clearUser } from '../../dux/reducer'
import { changeColor } from '../../dux/themeReducer'
import { dark } from '../MyMap/ColorThemes/dark'
import { silver } from '../MyMap/ColorThemes/silver'
import './Settings.css'


function Settings(props) {
    const handleLogout = () => {
        axios.get('/api/logout')
            .then(() => {
                props.history.push('/')
                props.clearUser()
            })
            .catch(err => console.log(err))
    }
    // console.log(props)
    return (
        <div className='settings'>
            <div id='innerDiv'>

                <h4 id='colorHeader'>Color</h4>
                <p >Choose one of the following color themes:</p>

                <button onClick={() => props.changeColor(null)}>Default</button>
                <button onClick={() => props.changeColor(dark)}>Dark</button>
                <button onClick={() => props.changeColor(silver)}>Silver</button>
            </div>


            <button onClick={handleLogout} id="logout">Logout</button>

        </div>
    )
}
const mapStateToProps = reduxState => ({ themereducer: reduxState.themereducer })

export default connect(mapStateToProps, { clearUser, changeColor })(Settings)
