import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Global design foundation (tokens, minimal base, opt-in primitives). Must stay first.
import './styles/foundation.css'
import './Components/Contact/OurOffice/OurOffice.css'
import './Components/Contact/WhatCanWeHelpYouWith/WhatCanWeHelpYouWith.css'
import './Components/Contact/AfterYouWrite/AfterYouWrite.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
