import React from 'react'
import AppRoutes from './AppRoutes'
import { BrowserRouter } from 'react-router-dom'

export default function App() {
  return (
    <div className='App'>
      <BrowserRouter>
      <AppRoutes/>
      </BrowserRouter>
    </div>
  )
}
