import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Landing from './Components/Landing/Landing'
import Settings from './Components/Settings/Settings'
import MyMap from './Components/MyMap/MyMap'
import FriendsProfile from './Components/FriendsProfile/FriendsProfile'

export default (
    <Switch>
        <Route exact path='/' component={Landing} />
        <Route path='/settings' component={Settings} />
        <Route path='/myMap' component={MyMap} />
        <Route path='/friend/:id' component={FriendsProfile} />
    </Switch>
)
