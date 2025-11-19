/**
 * Walrus integration utilities
 * Handles upload and retrieval of blobs from Walrus storage
 */

const WALRUS_PUBLISHER_URL = process.env.NEXT_PUBLIC_WALRUS_PUBLISHER_URL || 'https://publisher.walrus-testnet.walrus.space';
const WALRUS_AGGREGATOR_URL = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space';

export interface WalrusUploadResult {
  blobId: string;
  size: number;
  uploadedAt: string;
}

/**
 * Upload a blob to Walrus storage
 * Uses the Walrus HTTP API for browser compatibility
 */
export async function uploadToWalrus(
  data: Blob,
  metadata?: Record<string, string>
): Promise<WalrusUploadResult> {
  try {
    console.log('📤 Uploading to Walrus...', {
      size: data.size,
      type: data.type
    });

    // Upload to Walrus publisher
    const response = await fetch(`${WALRUS_PUBLISHER_URL}/v1/store`, {
      method: 'PUT',
      body: data,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Walrus upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    // Extract blob ID from response
    // Walrus returns different formats, handle both
    const blobId = result.newlyCreated?.blobObject?.blobId || 
                   result.alreadyCertified?.blobId ||
                   result.blobId;

    if (!blobId) {
      console.error('Walrus response:', result);
      throw new Error('No blob ID in Walrus response');
    }

    console.log('✅ Upload successful!', {
      blobId: blobId.substring(0, 20) + '...',
      size: data.size
    });

    return {
      blobId,
      size: data.size,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Walrus upload error:', error);
    throw error;
  }
}

/**
 * Retrieve a blob from Walrus storage
 */
export async function retrieveFromWalrus(blobId: string): Promise<Blob> {
  try {
    console.log('📥 Fetching from Walrus:', blobId);

    const response = await fetch(`${WALRUS_AGGREGATOR_URL}/v1/${blobId}`);

    if (!response.ok) {
      throw new Error(`Walrus retrieval failed: ${response.status}`);
    }

    const blob = await response.blob();
    
    console.log('✅ Retrieved blob:', {
      blobId: blobId.substring(0, 20) + '...',
      size: blob.size,
      type: blob.type
    });

    return blob;
  } catch (error) {
    console.error('❌ Walrus retrieval error:', error);
    throw error;
  }
}

/**
 * Check if a blob exists on Walrus
 */
export async function checkBlobExists(blobId: string): Promise<boolean> {
  try {
    const response = await fetch(`${WALRUS_AGGREGATOR_URL}/v1/${blobId}`, {
      method: 'HEAD',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Get blob info/metadata (if available)
 */
export async function getBlobInfo(blobId: string): Promise<{
  exists: boolean;
  size?: number;
}> {
  try {
    const response = await fetch(`${WALRUS_AGGREGATOR_URL}/v1/${blobId}`, {
      method: 'HEAD',
    });

    if (!response.ok) {
      return { exists: false };
    }

    const size = response.headers.get('content-length');

    return {
      exists: true,
      size: size ? parseInt(size, 10) : undefined,
    };
  } catch (error) {
    return { exists: false };
  }
}
