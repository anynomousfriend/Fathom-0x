#!/usr/bin/env node
/**
 * Walrus Blob Upload Script
 * 
 * This script uploads a file to Walrus storage and returns the Blob ID.
 * Usage: node upload_blob.js <file_path>
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function uploadToWalrus(filePath) {
  console.log('🌊 Uploading to Walrus Storage...\n');

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const fileName = path.basename(filePath);
  const fileSize = fs.statSync(filePath).size;

  console.log(`📄 File: ${fileName}`);
  console.log(`📦 Size: ${(fileSize / 1024).toFixed(2)} KB\n`);

  try {
    // Upload using Walrus CLI
    console.log('📤 Uploading to Walrus Testnet...');
    
    // Note: This assumes walrus CLI is installed
    // Install from: https://docs.walrus.site/usage/setup.html
    const output = execSync(
      `walrus store ${filePath}`,
      { encoding: 'utf-8' }
    );

    console.log(output);

    // Extract Blob ID from output
    // Format: "Blob ID: <blob_id>"
    const blobIdMatch = output.match(/Blob ID:\s*([a-zA-Z0-9_-]+)/);
    
    if (blobIdMatch) {
      const blobId = blobIdMatch[1];
      
      console.log('\n✅ Upload successful!\n');
      console.log('📍 Blob Information:');
      console.log(`   ├─ Blob ID: ${blobId}`);
      console.log(`   ├─ File:    ${fileName}`);
      console.log(`   └─ Size:    ${(fileSize / 1024).toFixed(2)} KB\n`);
      
      console.log('🔗 Access URL:');
      console.log(`   https://aggregator.walrus-testnet.walrus.space/v1/${blobId}\n`);
      
      console.log('📝 Next Steps:');
      console.log('   1. Save this Blob ID');
      console.log('   2. Use it when registering a document in the frontend');
      console.log('   3. Or update your .env file with: WALRUS_BLOB_ID=' + blobId + '\n');

      // Save to a JSON file for easy reference
      const outputData = {
        blobId,
        fileName,
        fileSize,
        uploadedAt: new Date().toISOString(),
        url: `https://aggregator.walrus-testnet.walrus.space/v1/${blobId}`
      };

      fs.writeFileSync(
        path.join(__dirname, '../walrus_blob_info.json'),
        JSON.stringify(outputData, null, 2)
      );

      console.log('💾 Blob info saved to: walrus_blob_info.json\n');

      return blobId;
    } else {
      console.error('❌ Could not extract Blob ID from output');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    console.log('\n💡 Make sure you have:');
    console.log('   1. Installed Walrus CLI');
    console.log('   2. Configured your Walrus wallet');
    console.log('   3. Have enough WAL tokens for storage\n');
    process.exit(1);
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node upload_blob.js <file_path>');
    console.log('\nExample:');
    console.log('  node upload_blob.js ../assets/sample_document.pdf');
    process.exit(1);
  }

  const filePath = args[0];
  uploadToWalrus(filePath);
}

module.exports = { uploadToWalrus };
