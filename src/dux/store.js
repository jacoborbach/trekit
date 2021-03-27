import { createStore, combineReducers } from 'redux'
import reducer from './reducer'
import dimensionReducer from './dimensionReducer'

const rootReducer = combineReducers({
    userReducer: reducer,
    dimensionReducer
})

export default createStore(rootReducer)