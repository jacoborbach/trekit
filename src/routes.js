import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Landing from './Components/Landing/Landing'
import Settings from './Components/Settings/Settings'
import MyMap from './Components/MyMap/MyMap'

export default (
    <Switch>
        <Route exact path='/' component={Landing} />
        <Route path='/settings' component={Settings} />
        <Route path='/myMap' component={MyMap} />
    </Switch>
)
