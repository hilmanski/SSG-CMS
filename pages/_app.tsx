import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import Login from '../components/Login'

function MyApp({ Component, pageProps }: AppProps) {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <div>
      {
        loggedIn ? <Component {...pageProps} /> 
                 : <Login setLoggedIn={setLoggedIn} />
      }
    </div>
  ) 
}

export default MyApp

