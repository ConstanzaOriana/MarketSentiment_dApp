const hre = require("hardhat");
const signers = {};
let owner;

async function main() {

  [owner] = await ethers.getSigners();

  const marketSentimentFactory = await hre.ethers.getContractFactory("MarketSentiment");
  const marketSentimentInstance = await marketSentimentFactory.deploy();

  await marketSentimentInstance.deployed();

  console.log(
    `MarketSentiment CONTRACT:  ${marketSentimentInstance.address} || 
    Deployed by ${owner.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
