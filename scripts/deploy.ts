#!/usr/bin/env ts-node
/**
 * Fathom Contract Deployment Script
 * 
 * This script deploys the Fathom smart contract to Sui Testnet and
 * saves the deployment addresses for use by the oracle and frontend.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface DeploymentAddresses {
  packageId: string;
  adminCapId: string;
  configObjectId: string;
  network: string;
  deployedAt: string;
  deployer: string;
}

async function main() {
  console.log('🚀 Deploying Fathom Contract to Sui Testnet...\n');

  try {
    // Step 1: Build the contract
    console.log('📦 Building contract...');
    process.chdir(path.join(__dirname, '../contracts'));
    
    const buildOutput = execSync('sui move build', { encoding: 'utf-8' });
    console.log('✅ Contract built successfully\n');

    // Step 2: Publish to testnet
    console.log('📤 Publishing to Sui Testnet...');
    console.log('   (This may take 30-60 seconds)\n');
    
    const publishOutput = execSync(
      'sui client publish --gas-budget 50000000 --json',
      { encoding: 'utf-8' }
    );

    const publishResult = JSON.parse(publishOutput);
    
    // Step 3: Extract important addresses
    console.log('📋 Extracting deployment addresses...\n');
    
    const packageId = publishResult.objectChanges.find(
      (obj: any) => obj.type === 'published'
    )?.packageId;

    const adminCapId = publishResult.objectChanges.find(
      (obj: any) => obj.objectType?.includes('AdminCap')
    )?.objectId;

    const configObjectId = publishResult.objectChanges.find(
      (obj: any) => obj.objectType?.includes('FathomConfig')
    )?.objectId;

    if (!packageId || !adminCapId || !configObjectId) {
      throw new Error('Failed to extract deployment addresses');
    }

    // Get deployer address
    const activeAddress = execSync('sui client active-address', { 
      encoding: 'utf-8' 
    }).trim();

    const addresses: DeploymentAddresses = {
      packageId,
      adminCapId,
      configObjectId,
      network: 'testnet',
      deployedAt: new Date().toISOString(),
      deployer: activeAddress,
    };

    // Step 4: Save to JSON file
    const outputPath = path.join(__dirname, '../deployed_addresses.json');
    fs.writeFileSync(outputPath, JSON.stringify(addresses, null, 2));
    
    console.log('✅ Contract deployed successfully!\n');
    console.log('📍 Deployment Addresses:');
    console.log('   ├─ Package ID:     ', packageId);
    console.log('   ├─ Admin Cap ID:   ', adminCapId);
    console.log('   ├─ Config Object:  ', configObjectId);
    console.log('   └─ Deployer:       ', activeAddress);
    console.log('\n💾 Addresses saved to: deployed_addresses.json');
    console.log('\n🔍 View on Explorer:');
    console.log(`   https://suiscan.xyz/testnet/object/${packageId}\n`);

    // Step 5: Instructions
    console.log('📝 Next Steps:');
    console.log('   1. Copy these addresses to oracle-node/.env');
    console.log('   2. Copy these addresses to frontend/.env.local');
    console.log('   3. Start the oracle: cd oracle-node && python3 oracle_node.py');
    console.log('   4. Start the frontend: cd frontend && npm run dev\n');

  } catch (error: any) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

main();
