# Segrega LACChain Transaction Hash Validator

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

This is a **NestJS console application** that generates Segrega app transaction hashes and stores them into a LACChain smart contract to provide a verifiable mechanism for data integrity. The application ensures that all confirmed transactions are cryptographically linked and stored on the blockchain, creating an immutable audit trail.

### Key Features

- **Transaction Hash Generation**: Creates SHA-256 hashes for confirmed transactions using a chained approach
- **LACChain Integration**: Stores accumulated transaction hashes in a smart contract on the LACChain network
- **Data Integrity Verification**: Provides cryptographic proof of transaction integrity through blockchain storage
- **Scheduled Processing**: Automatically processes pending transactions every 10 seconds
- **Database Integration**: Uses PostgreSQL with TypeORM for transaction management
- **Smart Contract Management**: Includes Hardhat project for contract deployment and management

### How It Works

1. The application monitors the database for confirmed transactions that don't have immutable hashes
2. For each batch of pending transactions, it generates a chained hash using:
   - Previous transaction hash (validating with smart contract stored hash that it matches)
   - Source user UUID
   - Target user UUID
   - Transaction amount
3. The generated hash is stored in the database and then sent to the LACChain smart contract (but waits until smart contract is changed before comitting changes)
4. This creates an immutable, verifiable chain of all transaction data

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- LACChain network access
- Environment variables configured (see Configuration section)

## Installation

```bash
# Install dependencies
$ npm install

# Install Hardhat dependencies (for smart contract management)
$ cd hardhat-contract-manager
$ npm install
$ cd ..
```

## Configuration

The application uses environment variables for configuration. Set the following variables:

```bash
# Database Configuration
CNF__DB__HOST=localhost
CNF__DB__PORT=5432
CNF__DB__USER=postgres
CNF__DB__PASSWORD=your_password
CNF__DB__DATABASE=unp_segrega
CNF__DB__SSL_ENABLE=false
CNF__DB__RUN_MIGRATIONS=false

# LACChain Configuration
CNF__LACCHAIN__RPC_NODE=http://your-lacchain-node:4545
CNF__LACCHAIN__NODE_ADDRESS=0xYourNodeAddress
CNF__LACCHAIN__PRIVATE_KEY=0xYourPrivateKey
CNF__LACCHAIN__CONTRACT_ADDRESS=0xYourContractAddress
CNF__LACCHAIN__CONTRACT_ABI=[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"}...]
```

## Running the Application

### Development Mode

```bash
# Start with hot reload
$ npm run start:dev

# Or start normally
$ npm run start
```

### Production Mode

```bash
# Build the application
$ npm run build

# Start in production mode
$ npm run start:prod
```

## Smart Contract Management

The project includes a Hardhat project under `hardhat-contract-manager/` for managing the LACChain smart contracts.

### Deploying the HashValidator Contract

```bash
# Navigate to the Hardhat project
$ cd hardhat-contract-manager

# Compile contracts
$ npx hardhat compile

# Generate a new private key (if needed)
$ node scripts/mkprivkey.js

# Deploy the HashValidator contract
$ npx hardhat run scripts/deployHashValidator.js

# Update the CONTRACT_ADDRESS in your environment variables
```

## Project Structure

```
src/
├── main-module/
│   ├── datasources/
│   │   └── database/
│   │       └── models/entity/    # Database entities
│   ├── services/
│   │   └── transaction-hash.scheduler.ts  # Main hash processing service
│   └── util/
│       └── mutex.ts              # Concurrency control
├── config.provider.ts            # Configuration management
└── main.ts                       # Application entry point

hardhat-contract-manager/
├── contracts/
│   ├── HashValidator.sol         # Main smart contract
│   └── BaseRelayRecipient.sol    # LACChain base contract
├── scripts/
│   ├── deployHashValidator.js    # Deployment script
│   └── mkprivkey.js              # Key generation utility
└── package.json                  # Hardhat dependencies
```

## Architecture

The application follows a modular architecture:

- **Scheduler Service**: Processes transactions every 10 seconds using NestJS cron jobs
- **Database Layer**: Manages transaction data with TypeORM and PostgreSQL
- **Blockchain Integration**: Uses ethers.js with LACChain gas model provider
- **Smart Contract**: Simple storage contract for hash validation
- **Configuration**: Environment-based configuration with fallback values

## Security Considerations

- Private keys for non local nodes should be stored securely and never committed to version control
- Database connections should use SSL in production
- Smart contract addresses should be verified before deployment
- Regular monitoring of transaction processing is recommended
