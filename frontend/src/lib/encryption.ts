/**
 * Encryption utilities for Fathom-0x Protocol
 * Handles client-side encryption/decryption of documents
 */

import crypto from 'crypto-browserify';

/**
 * Generate a random encryption key
 */
export function generateEncryptionKey(): string {
  // Generate 256-bit (32 bytes) key
  const key = crypto.randomBytes(32);
  return key.toString('hex');
}

/**
 * Encrypt a file using AES-256-CBC
 */
export async function encryptFile(
  file: File,
  encryptionKey?: string
): Promise<{ encryptedData: Blob; key: string; iv: string }> {
  // Generate or use provided key
  const key = encryptionKey || generateEncryptionKey();
  
  // Generate initialization vector
  const iv = crypto.randomBytes(16);
  
  // Read file as ArrayBuffer
  const fileBuffer = await file.arrayBuffer();
  const fileData = Buffer.from(fileBuffer);
  
  // Create cipher
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'hex'),
    iv
  );
  
  // Encrypt data
  const encrypted = Buffer.concat([
    cipher.update(fileData),
    cipher.final()
  ]);
  
  // Convert to Blob
  const encryptedBlob = new Blob([encrypted], { type: 'application/octet-stream' });
  
  return {
    encryptedData: encryptedBlob,
    key: key,
    iv: iv.toString('hex')
  };
}

/**
 * Decrypt data using AES-256-CBC
 */
export function decryptData(
  encryptedData: Buffer,
  key: string,
  iv: string
): Buffer {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'hex'),
    Buffer.from(iv, 'hex')
  );
  
  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final()
  ]);
  
  return decrypted;
}

/**
 * Hash data using SHA-256
 */
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate a document fingerprint
 */
export function generateFingerprint(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        const buffer = Buffer.from(e.target.result as ArrayBuffer);
        const hash = crypto.createHash('sha256').update(buffer).digest('hex');
        resolve(hash);
      }
    };
    
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
