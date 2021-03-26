import axios from 'axios';
import React from 'react'
import { connect } from 'react-redux'
import { clearUser, getUser } from '../../dux/reducer'
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
