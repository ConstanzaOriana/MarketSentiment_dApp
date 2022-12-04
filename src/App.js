import React, { useContext } from 'react';
import './App.css';
import { Bubble } from './components/bubble';
import { Navbar } from './components/navbar'
import AppContext from './context/AppContext';
import { Footer } from './components/footer';
import swal from 'sweetalert';


function App() {

  const { loginMetaMask, network } = useContext(AppContext)

  return (
    <>
    <div className="App">
      <Navbar />
      <div className='App-title'>
        <p className='App-phrase'>🔮 PLACE YOUR BETS! 🔮</p>
      </div>
      {(network !== 80001) ?
        <div className='App-message'>
          <h1>PLEASE CONNECT TO MUMBAI NETWORK</h1>
          <h2>AND RELOAD THE WEBSITE</h2>
          <h2>IN ORDER TO GET MARKET SENTIMENT & EMIT YOUR VOTE</h2>
        </div>
        :
        <div>
          <div className='App-bubbles'>
            <Bubble ticker="BTC" />
            <Bubble ticker="ETH" />
            <Bubble ticker="SOL" />
          </div>
          {!loginMetaMask &&
            <div className='App-login-message'>
              <p>Please access 🦊 in order to vote</p>
            </div>
          }
        </div>        
      }
      <Footer/>
    </div>
    </>
  );
}

export default App;
