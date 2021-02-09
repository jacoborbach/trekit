import React, { Component } from 'react'
import './App.css';
import { Switch, Route } from 'react-router-dom'
import Landing from './Components/Landing/Landing'
import Settings from './Components/Settings/Settings'
import Header from './Components/Header/Header'
import MyMap from './Components/MyMap/MyMap'


export class App extends Component {
  constructor() {
    super();
    this.state = {
      userObj: {}
    }
  }

  setUser = (userObj) => {
    this.setState({ userObj })
  }

  render() {
    // console.log(this.state.userObj)
    return (
      <div className='App'>
        <Header />

        <Switch>
          <Route
            exact path='/'
            render={() => (
              <Landing setUser={this.setUser} isAuthed={true} />
            )}
          />
          <Route path='/settings' component={Settings} />
          <Route
            path='/myMap'
            render={() => (
              <MyMap user={this.state.userObj} isAuthed={true} />
            )}
          />
        </Switch>

      </div>
    )
  }
}

export default App
