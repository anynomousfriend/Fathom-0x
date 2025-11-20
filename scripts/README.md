# Fathom Scripts

Utility scripts for deploying and managing the Fathom-0x Protocol.

## Scripts

### `deploy.ts`
Deploys the Fathom smart contract to Sui Testnet.

```bash
npm run deploy
# or
ts-node deploy.ts
```

### `upload_blob.js`
Uploads a file to Walrus storage.

```bash
node upload_blob.js path/to/file.pdf
```

## Setup

```bash
npm install
```

## Requirements

- Sui CLI installed and configured
- Walrus CLI installed and configured
- Active Sui wallet with testnet SUI
- Walrus wallet with WAL tokens
