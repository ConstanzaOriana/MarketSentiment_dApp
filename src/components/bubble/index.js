import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../context/AppContext'
import { Button } from '../button'
import swal from 'sweetalert';

import "./index.css"


export const Bubble = (props) => {

    const [sentimentText, setsentimentText] = useState()
    const ticker = props.ticker;

    const { loginMetaMask, marketSentimentInstance, marketInstance } = useContext(AppContext)

    const bubbleStyle = {
        marginTop: `${100 - sentimentText}%`,
        backgroundColor: (sentimentText >= 50 ? "green" : "red"),
    }

    const bubbleCircleStyle = {
        boxShadow: `0 0 30px ${(sentimentText >= 50 ? "green" : "red")}`
    }
    
    const getMarketSentiment = async (ticker) => {

        if (!marketInstance) { return null }
        const [_votesFor, _votesAgainst, _totalVotes] = await marketInstance.countVotes(ticker);

        if (_totalVotes > 0) {
            let perc = Math.round((_votesFor / _totalVotes) * 100)
            setsentimentText(perc)
        }
    }

    getMarketSentiment(ticker)

    const voteTicker = async (ticker, vote) => {
        if (!marketSentimentInstance) { return null }
        try {
            const voteTx = await marketSentimentInstance.voteTicker(ticker, vote)
        } catch (err) {
            const reason = err.reason.replace("execution reverted: ", "");
            if (reason == "You have already voted this token") {
                swal({
                    title: "Error on voting",
                    text: "You have already voted this ticker",
                    icon: "warning",
                    button: "Return"
                  })
            }
        }
    }

    return (
        <div className='bubble-modal' >
            <div className='bubble-circle' style={bubbleCircleStyle}>
                <div className='wave' style={bubbleStyle}></div>
                <div className='bubble-circle-sentiment'>{sentimentText}%</div>
            </div>
            <div className='bubble-buttons'>
                <Button className="buttonUp" disabled={!loginMetaMask} onClick={() => voteTicker(ticker, true)}>UP</Button>
                <Button className="buttonDown" disabled={!loginMetaMask} onClick={() => voteTicker(ticker, false)}>DOWN</Button>
            </div>
            <p className='bubble-circle-ticker'>{ticker}</p>
        </div>
    )
}
