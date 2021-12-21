# HealthInsurance_Dapp

This is a decentralized application for maintaining Health Insurance details recording some of the important transactions on blockchain which can be verified by anyone.

Prerequistes:
- Chrome browser with metamask extension
- Ganache application (test environment)

Usage Instructions : 

1. Contract Deployment:
  - Install Ganache and start it.
  - Add the accounts from Ganache to Metamask using the phrase provided in Ganache
  - Install truffle in your environment using:
    > npm install truffle
  - Navigate to /HealthInsurance-Contract/ and instialize truffle using below command:
    > truffle init
  - Now, from the same directory, compile and deploy the contract using below commands:
    > truffle compile
    > truffle migrate --reset
  - Optional : To deploy to a test network (say Ropsten), use below command:
    > truffle migrate --network ropsten
  - Copy the contract address from the original contract (usually second one, first one is for Migrations)
  - Update this contract address in line 2 of /HealthInsurance-app/src/js/app.js

\
\
2. Web app intialization:
  - Navigate to application directory i.e., /HealthInsurance-app/ and install node modules using:
    > npm install
  - Now, start the application:
    > npm start
