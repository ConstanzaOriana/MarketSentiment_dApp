import React, { useContext } from 'react'
import "./index.scss"
import AppContext from '../../context/AppContext'

export const Navbar = () => {

  const { loginMetaMask, user, conectMetamask, network } = useContext(AppContext)

  return (
    <div className='navbar'>
      <div className='navbar-brand'>
        <p>Market Sentiment dApp</p>
      </div>
      <div className='navbar-connection'>
        {network == 80001 ?
          <>
            {loginMetaMask ?
              <p>Wallet Connected: {user}</p>
              :
              <button onClick={conectMetamask} className='navbar-loginbutton'>
                🦊 Connect  🦊
              </button>
            }
          </> :
          <p>Change to Mumbai Network</p>
        }

      </div>
    </div>
  )
}
