require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");

const dotenv = require('dotenv')

dotenv.config();

module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {},
    mumbai: {
      url: process.env.POLYGON_MUMBAI,
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLY_API_KEY}
  }
};
