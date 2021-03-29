import React from 'react'
import Header from './Components/Header/Header'
import routes from './routes'
import './App.css';
// import useWindowDimensions from './useWindowDimensions'

export default function App() {
  // const { height, width } = useWindowDimensions();
  return (
    <div className='App'>
      <Header />
      {routes}
    </div>
  )
}