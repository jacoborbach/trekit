import { createStore, combineReducers } from 'redux'
import reducer from './reducer'
import themeReducer from './themeReducer'

const rootReducer = combineReducers({
    userReducer: reducer,
    themeReducer
})

export default createStore(rootReducer)