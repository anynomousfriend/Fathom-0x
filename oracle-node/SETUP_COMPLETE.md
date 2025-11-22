# Oracle Node Setup Complete

## Issue Resolved

**Problem:** `ModuleNotFoundError: No module named 'pysui'`

**Solution:** Installed all required dependencies from `requirements.txt` including:
- `pysui` (v0.93.0) - Sui Python SDK
- `pysui-fastcrypto` (v0.7.0) - Cryptography support
- All other dependencies (aiohttp, httpx, websockets, etc.)

## Configuration

The `.env` file has been properly configured with:

```env
# Sui Network
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
ORACLE_PRIVATE_KEY=suiprivkey1qpzc... (from sui keytool export)

# Walrus Storage
WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space

# Smart Contract Addresses (from deployed_addresses.json)
CONTRACT_PACKAGE_ID=0xc1c7e98b6ec28ed8c722e8dba6dcadded25797a88b1778bdf3f9a754ed275274
CONFIG_OBJECT_ID=0xd4f796e0c1f82064d8f1ed8f4fae3e061869f485f53d16e82b139a49301392d1

# Oracle Settings
POLL_INTERVAL=10
```

## How to Run

### Using the Virtual Environment

1. **Activate the virtual environment:**
 ```bash
 cd oracle-node
 source venv/bin/activate
 ```

2. **Run the oracle node:**
 ```bash
 python oracle_node.py
 ```

### Direct Execution (without activating venv)

```bash
cd oracle-node
./venv/bin/python oracle_node.py
```

## Verification Tests

All core functionality has been tested and verified:

 **Oracle Initialization** - Successfully connects to Sui testnet
 **Walrus Integration** - Blob fetching configured correctly
 **Query Processing** - AI/RAG simulation works
 **Signature Generation** - Cryptographic signing operational
 **Blockchain Submission** - Transaction building configured

## Usage Example

The oracle node will:
1. Listen for `QuerySubmitted` events from the blockchain
2. Fetch encrypted documents from Walrus storage
3. Process queries using AI (simulated for hackathon)
4. Sign the answers cryptographically
5. Submit answers back to the blockchain

To stop the oracle node, press `Ctrl+C`.

## Development Notes

- The virtual environment is located at `oracle-node/venv/`
- Dependencies are listed in `requirements.txt`
- To install additional packages: `./venv/bin/pip install package_name`
- To update dependencies: `./venv/bin/pip install -r requirements.txt --upgrade`

## Troubleshooting

If you encounter issues:

1. **Verify dependencies:**
 ```bash
 ./venv/bin/pip list | grep pysui
 ```

2. **Check environment variables:**
 ```bash
 cat .env
 ```

3. **Test oracle initialization:**
 ```bash
 ./venv/bin/python -c "from oracle_node import FathomOracle; oracle = FathomOracle()"
 ```

## Next Steps

The oracle node is now fully operational and ready to:
- Process real queries from the frontend
- Fetch documents from Walrus
- Submit verified answers to the blockchain
- Demonstrate verifiable RAG for private data

 **Setup Complete!** The Fathom Oracle Node is ready for use.
