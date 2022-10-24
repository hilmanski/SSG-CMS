import { useEffect } from 'react'
import { setCookie, getCookie, getStorageKeyNameForSecretCode } from '../utils/cookies'

export default function Login({setLoggedIn}: {setLoggedIn: Function}) {

    const storageCodeName = getStorageKeyNameForSecretCode()
    
    async function handleSubmitPassword() {
      const password = (document.getElementById('secretCode') as HTMLInputElement).value
  
      if(password.trim() === '') {
        alert('Please enter a secret code')
        return
      }
      
      verifyPassword(password).then((response) => {
        if(response) {
            setCookie(storageCodeName, password, 1) // remember for 1 day
            setLoggedIn(true)
        } else {
            alert('Wrong secret code')
            return
        }
      })
    }

    function verifyPassword(password: string) {
        return fetch('/api/verifyPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password: password})
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success') {
                return true
            } else {
                return false
            }
        })
        .catch(err => {
            alert('Sorry! something wrong on our end when verifying')
            console.log(err)
            return false
        })
    }
  
    useEffect(() => {
      // check if ssg_secret_code is on cookies
      const ssg_secret_code = getCookie(storageCodeName)
      if(ssg_secret_code) {
        setLoggedIn(true)
      }
    },[])

   return (
        <div>
          <h1 className="text-3xl font-bold underline"> Login first </h1>
          <p>CMS - SSG log you in based on <b> secret code</b> you provide.</p>

          <div className='mt-5'>
            <label htmlFor="secretCode">Secret Code: </label>
            <input className='block w-full p-2 mt-2' id="secretCode" type="password" />

            <button onClick={handleSubmitPassword} className='block border-white rounded mt-5 p-2 w-full border'> Submit </button>
          </div>
        </div>
    )
}