# Farcaster Discovery

A Node.js service that processes flash messages from Farcaster users and automatically creates Zora coins (tokens) for captured Invader street art pieces.

## Overview

This service listens to a RabbitMQ queue for flash messages containing information about Invader street art captures. When a flash is detected, it:

1. Resolves the Farcaster ID (FID) to get the user's verified Ethereum address using the Neynar API
2. Downloads the flash image from the provided URL
3. Uploads metadata to Zora including the image, name, symbol, and description
4. Creates a new Zora coin on Base or Base Sepolia (testnet/mainnet auto-selected)

## Features

- **RabbitMQ Integration**: Processes messages from a configurable RabbitMQ queue
- **Farcaster Integration**: Uses Neynar API to resolve FIDs to Ethereum addresses
- **Zora Coin Creation**: Automatically creates tokens on Zora protocol
- **Image Processing**: Downloads and uploads flash images to IPFS via Zora
- **Testnet/Mainnet Support**: Deploys coins on Base Sepolia (testnet) or Base (mainnet) depending on `NODE_ENV`
- **Structured Logging**: Uses Winston for robust, structured logs

## Prerequisites

- Node.js >= 20.0.0
- Yarn package manager
- Access to required API keys and services

## Installation

1. Clone the repository:

```bash
git clone https://github.com/gitpancake/farcaster.discovery.git
cd farcaster.discovery
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file in the root directory with the following environment variables:

```env
# API Keys
NEYNAR_API_KEY=your_neynar_api_key_here
ZORA_API_KEY=your_zora_api_key_here

# Blockchain
PRIVATE_KEY=your_ethereum_private_key_here

# RabbitMQ Configuration
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE=flash_queue_name

# Environment
NODE_ENV=development # or 'production' for mainnet
```

## Usage

### Development

Start the development server with hot reload:

```bash
yarn dev
```

### Production (Mainnet)

Build the project:

```bash
yarn build
```

Start the production server (ensure `NODE_ENV=production` for mainnet):

```bash
NODE_ENV=production yarn start
```

## Project Structure

```
src/
├── index.ts              # Main entry point
├── consume.ts            # Flash message consumer implementation
├── neynar/
│   ├── base.ts          # Base Neynar API client
│   └── users.ts         # User-related API operations
├── rabbitmq/
│   └── index.ts         # RabbitMQ base consumer class
├── util/
│   ├── cities.ts        # City-related utilities
│   ├── strings.ts       # String manipulation utilities
│   ├── logger.ts        # Winston-based Logger utility
│   └── network.ts       # Network config utility (testnet/mainnet)
└── zora/
    ├── metadataUpload.ts # Zora metadata upload functionality
    └── CoinDeployer.ts   # Coin deployment logic
```

## Message Format

The service expects messages in the following JSON format:

```json
{
  "fid": 732,
  "flash": {
    "flash_id": 81877953,
    "city": "San Diego",
    "player": "WORLDY",
    "img": "https://invader-flashes.s3.us-east-2.amazonaws.com/media/queries/2025/03/27/image_A2tHBOe.jpg",
    "text": "San Diego, WORLDY",
    "timestamp": "2025-03-26 16:06:43.918",
    "flash_count": "32 750 197"
  }
}
```

## Dependencies

### Core Dependencies

- `@neynar/nodejs-sdk`: Farcaster API integration
- `@zoralabs/coins-sdk`: Zora protocol integration
- `amqplib`: RabbitMQ client
- `axios`: HTTP client
- `dotenv`: Environment variable management
- `viem`: Ethereum client library
- `winston`: Logging utility
- `zora`: Zora protocol utilities

### Development Dependencies

- `@types/amqplib`: TypeScript definitions for amqplib
- `@types/node`: TypeScript definitions for Node.js
- `nodemon`: Development server with auto-restart
- `typescript`: TypeScript compiler

## Configuration

### Environment Variables

| Variable         | Description                                        | Required |
| ---------------- | -------------------------------------------------- | -------- |
| `NEYNAR_API_KEY` | Neynar API key for Farcaster integration           | Yes      |
| `ZORA_API_KEY`   | Zora API key for protocol access                   | Yes      |
| `PRIVATE_KEY`    | Ethereum private key for transaction signing       | Yes      |
| `RABBITMQ_URL`   | RabbitMQ connection URL                            | Yes      |
| `RABBITMQ_QUEUE` | RabbitMQ queue name to consume from                | Yes      |
| `NODE_ENV`       | Set to 'production' for mainnet, otherwise testnet | Yes      |

### Blockchain Configuration

The service is configured to work with:

- **Network**: Base Sepolia testnet (default) or Base mainnet (`NODE_ENV=production`)
- **Currency**: ETH
- **Gas Multiplier**: 120% (for reliable transaction processing)

## Logging

This project uses [Winston](https://github.com/winstonjs/winston) for structured logging.

- In development, logs are pretty-printed with timestamps and log levels.
- In production, logs are output as JSON for easy ingestion by log management tools.
- Only essential information is logged for coin deployments: contract address, transaction hash, explorer URL, and status.

### Example Log Output

**Development:**

```
[2024-05-01T12:00:00.000Z] [INFO] Coin deployed
{
  "contractAddress": "0x...",
  "txHash": "0x...",
  "explorerUrl": "https://basescan.org/tx/0x...",
  "status": 1
}
```

**Production:**

```
{"timestamp":"2024-05-01T12:00:00.000Z","level":"info","message":"Coin deployed","data":{"contractAddress":"0x...","txHash":"0x...","explorerUrl":"https://basescan.org/tx/0x...","status":1}}
```

## Error Handling

The service includes comprehensive error handling:

- RabbitMQ message acknowledgment/nacknowledgment
- Graceful error logging and recovery
- Transaction failure handling
- API rate limiting considerations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License

## Support

For issues and questions:

- GitHub Issues: [https://github.com/gitpancake/farcaster.discovery/issues](https://github.com/gitpancake/farcaster.discovery/issues)
- Repository: [https://github.com/gitpancake/farcaster.discovery](https://github.com/gitpancake/farcaster.discovery)
