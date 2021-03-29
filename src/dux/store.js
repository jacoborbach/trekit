import { createStore, combineReducers } from 'redux'
import reducer from './reducer'

const rootReducer = combineReducers({
    userReducer: reducer
})

export default createStore(rootReducer)