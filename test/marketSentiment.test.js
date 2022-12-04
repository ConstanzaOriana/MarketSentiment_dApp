const { expect } = require("chai");
const { ethers } = require("hardhat");
let marketSentimentFactory;
let marketSentimentInstance;
const signers = {};
let owner;

describe("Tests on marketSentiment Contract", function () {

  describe("Deploy", function () {
    it("Should deploy the smart contract", async function () {
      const [deployer, firstUser, secondUser] = await ethers.getSigners();
      [owner] = await ethers.getSigners();
      signers.deployer = deployer;
      signers.firstUser = firstUser;
      signers.secondUser = secondUser;

      marketSentimentFactory = await ethers.getContractFactory("MarketSentiment");
      marketSentimentInstance = await marketSentimentFactory.deploy();
      await marketSentimentInstance.deployed();

    })
  })
  
  describe("Test on Adding Ticker", function () {
    it("Should allow owner to add a ticker", async function () {
      [owner] = await ethers.getSigners();
      const tx = await marketSentimentInstance.addTicker("_TickerPrueba")
      tx.wait();
      expect(tx.from).to.equal(owner.address)      
    })
    
    it("Should not allow common users to add a ticker", async function () {
      [firstUser] = await ethers.getSigners();
      const marketSentimentInstanceFirstUser = await marketSentimentInstance.connect(signers.firstUser);
      const failTicker = marketSentimentInstanceFirstUser.addTicker("_TickerFailAdd");
      await expect(failTicker).to.be.revertedWith("Only the owner can excute this function");
    })
    
    it("Should not allow to add twice the same ticker", async function () {
      const tx = await marketSentimentInstance.addTicker("_NewTicker")
      tx.wait();
      const txFail = marketSentimentInstance.addTicker("_NewTicker");
      await expect(txFail).to.be.revertedWith("This ticker already exists");
    })
  })
  
  describe('Tests on Voting Tickers', async () => {

    it("Should emit the event when voting", async function () {
      const tx = await marketSentimentInstance.voteTicker("_NewTickerEmit", true)
      tx.wait();
      expect(tx).to.emit("MarketSentiment", "_tickerUpdated");
    })

    it("Should not allow to vote twice the same address", async function () {
      
      [firstUser] = await ethers.getSigners();
      const marketSentimentInstanceFirstUser = await marketSentimentInstance.connect(signers.firstUser);
      const FirstVoteUser1Tx = await marketSentimentInstanceFirstUser.voteTicker("_NewTickerEmit", true)
      FirstVoteUser1Tx.wait();
    
      const SecondVoteUser1Tx = marketSentimentInstanceFirstUser.voteTicker("_NewTickerEmit", false)
      await expect(SecondVoteUser1Tx).to.be.revertedWith('You have already voted this token')
    })
      
  })

  describe('Tests on Count Tickers', async () => {

    it("Ticker should exist for running Count function", async function () {
    await expect(marketSentimentInstance.countVotes("_UnexistingTicker")).to.be.revertedWith("The ticker doesnt exist")

    })

    it("Should return the votes of a ticker", async function () {

      const txAddTicker = await marketSentimentInstance.addTicker("_TickerVotingTest")
      txAddTicker.wait();

      [firstUser] = await ethers.getSigners();
      const marketSentimentInstanceFirstUser = await marketSentimentInstance.connect(signers.firstUser);
      const txVotoUser1 = await marketSentimentInstanceFirstUser.voteTicker("_TickerVotingTest", true)
      txVotoUser1.wait();

      [secondUser] = await ethers.getSigners();
      const marketSentimentInstanceSecondtUser = await marketSentimentInstance.connect(signers.secondUser);
      const txVotoUser2 = await marketSentimentInstanceSecondtUser.voteTicker("_TickerVotingTest", false);
      txVotoUser2.wait();

      [deployer] = await ethers.getSigners();
      const marketSentimentInstanceThirdUser = await marketSentimentInstance.connect(signers.deployer);
      const txVotoUser3 = await marketSentimentInstanceThirdUser.voteTicker("_TickerVotingTest", true);
      txVotoUser3.wait();

      const [votesFor, votesAgainst, totalVotes] = await marketSentimentInstance.countVotes("_TickerVotingTest")
      console.log('Votes For: ' + votesFor, ' | Votes Against :' + votesAgainst, " | Total Votes: " + totalVotes)
    })

  })

})

