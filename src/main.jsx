import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Components/Contact/ContactHero/ContactHero.css'
import './Components/Contact/PreferToReachUsDirectly/PreferToReachUsDirectly.css'
import './Components/Contact/WhatCanWeHelpYouWith/WhatCanWeHelpYouWith.css'
import './Components/Contact/WhatHappensNext/WhatHappensNext.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
