import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CanchApp } from './CanchApp'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <CanchApp />
    </StrictMode>
  </BrowserRouter>
)
