/**
 * Walrus integration utilities
 * Handles upload and retrieval of blobs from Walrus storage
 * Uses enhanced Walrus client with automatic fallback to mock mode
 */

import { walrusClient, WalrusUploadResult as WalrusClientUploadResult } from './walrus-client';

export interface WalrusUploadResult {
  blobId: string;
  size: number;
  uploadedAt: string;
  suiRefObject?: string;
  endEpoch?: number;
}

/**
 * Upload a blob to Walrus storage
 * Automatically tries real Walrus first, falls back to mock if unavailable
 */
export async function uploadToWalrus(
  data: Blob,
  metadata?: Record<string, string>,
  forceMock?: boolean
): Promise<WalrusUploadResult> {
  // If mock mode is forced, skip real upload
  if (forceMock) {
    console.log('🔧 Mock mode enabled - skipping real Walrus upload');
    const { uploadToWalrusMock } = await import('./walrus-mock');
    return uploadToWalrusMock(data, metadata);
  }
  try {
    console.log('📤 Starting Walrus upload...', {
      size: data.size,
      type: data.type,
      metadata,
    });

    // Try real Walrus upload using enhanced client
    const result = await walrusClient.upload(data, {
      epochs: 5, // Store for 5 epochs (configurable)
    });

    console.log('OK Walrus upload successful!', {
      blobId: result.blobId.substring(0, 20) + '...',
      size: result.size,
      endEpoch: result.endEpoch,
    });

    return result;
  } catch (error) {
    console.error('ERROR Walrus upload error:', error);
    console.warn('⚠️ Falling back to mock mode - Walrus testnet may be down or rate-limited');
    
    // Fall back to mock mode
    const { uploadToWalrusMock } = await import('./walrus-mock');
    return uploadToWalrusMock(data, metadata);
  }
}

/**
 * Retrieve a blob from Walrus storage
 */
export async function retrieveFromWalrus(blobId: string): Promise<Blob> {
  try {
    console.log('📥 Retrieving from Walrus:', blobId);

    const blob = await walrusClient.download(blobId);
    
    console.log('OK Retrieved blob successfully:', {
      blobId: blobId.substring(0, 20) + '...',
      size: blob.size,
      type: blob.type
    });

    return blob;
  } catch (error) {
    console.error('ERROR Walrus retrieval error:', error);
    throw error;
  }
}

/**
 * Check if a blob exists on Walrus
 */
export async function checkBlobExists(blobId: string): Promise<boolean> {
  try {
    return await walrusClient.exists(blobId);
  } catch (error) {
    console.error('ERROR Error checking blob existence:', error);
    return false;
  }
}

/**
 * Get blob info/metadata (if available)
 */
export async function getBlobInfo(blobId: string): Promise<{
  exists: boolean;
  size?: number;
  contentType?: string;
}> {
  try {
    return await walrusClient.getMetadata(blobId);
  } catch (error) {
    console.error('ERROR Error getting blob metadata:', error);
    return { exists: false };
  }
}
