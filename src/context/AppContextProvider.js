import React, { useEffect, useState } from 'react'
import { ethers } from "ethers";
import AppContext from './AppContext';
const { abi } = require('../data/abi/MarketSentiment.json')

const contractAddr = ''
let ethProvider;
let ethSigner;
let ethAccount;
let actualNetwork;
let marketSentimentInstance = new ethers.Contract(contractAddr,
    abi)

const AppContextProvider = ({ children }) => {

    const [loginMetaMask, setloginMetaMask] = useState()
    const [user, setUser] = useState()
    const [marketInstance, setmarketInstance] = useState()
    const [network, setNetwork] = useState()

    useEffect(() => {
        async function init() {
            ethProvider = new ethers.providers.Web3Provider(window.ethereum)
            ethSigner = ethProvider.getSigner()
            marketSentimentInstance = new ethers.Contract(contractAddr,
                abi, ethSigner)
            setmarketInstance(marketSentimentInstance)
            actualNetwork = await ethProvider.getNetwork()
            setNetwork(actualNetwork.chainId)
        }
        init();

        if (network !== 80001) {
            try {
                window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x13881" }],
                });
                actualNetwork = ethProvider.getNetwork()
                setNetwork(actualNetwork.chainId)
            } catch (err) {
                if (err == 4902) {
                    window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: "0x13881",
                                rpcUrl: "https://rpc-mumbai.maticvigil.com",
                                chainName: "Polygon Testnet Mumbai",
                                nativeCurrency: {
                                    name: "tMATIC",
                                    symbol: "tMATIC",
                                    decimals: 18,
                                },
                            },
                        ],
                    });
                }
            }
        }
    }, [])

    async function conectMetamask() {

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0])
        setUser(account.substring(0, 5) + "..." + account.substring(35))
        setloginMetaMask(!loginMetaMask)
        handleAccountsChanged(accounts)
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    async function handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            console.log('Please connect to MetaMask.');
            return false
        } else {
            ethProvider = new ethers.providers.Web3Provider(window.ethereum)
            ethAccount = accounts[0]
            ethSigner = ethProvider.getSigner()
            marketSentimentInstance = new ethers.Contract(contractAddr,
                abi, ethSigner)
            window.ethProvider = ethProvider
            window.ethSigner = ethSigner
            setUser(ethAccount.substring(0, 5) + "..." + ethAccount.substring(35))
            setloginMetaMask(!loginMetaMask)
            actualNetwork = await ethProvider.getNetwork()
            setNetwork(actualNetwork.chainId)
            return {
                account: ethAccount,
                network: await ethProvider.getNetwork()
            }
        }
    }

    return (
        <AppContext.Provider value={{ loginMetaMask, setloginMetaMask, user, setUser, conectMetamask, marketSentimentInstance, marketInstance, network }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider