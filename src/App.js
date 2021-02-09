import React from 'react'
import Header from './Components/Header/Header'
import routes from './routes'
import './App.css';


export default function App() {
  return (
    <div className='App'>
      <Header />
      {routes}
    </div>
  )
}