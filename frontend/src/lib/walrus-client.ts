/**
 * Enhanced Walrus Client Implementation
 * Based on Walrus HTTP API specification
 * Supports both testnet and devnet endpoints
 */

export interface WalrusConfig {
  publisherUrl: string;
  aggregatorUrl: string;
  epochs?: number;
}

export interface WalrusUploadResult {
  blobId: string;
  size: number;
  uploadedAt: string;
  suiRefObject?: string;
  endEpoch?: number;
}

export interface WalrusUploadResponse {
  newlyCreated?: {
    blobObject: {
      id: string;
      storedEpoch: number;
      blobId: string;
      size: number;
      erasureCodeType: string;
      certifiedEpoch: number;
      storage: {
        id: string;
        startEpoch: number;
        endEpoch: number;
        storageSize: number;
      };
    };
    encodedSize: number;
    cost: number;
  };
  alreadyCertified?: {
    blobId: string;
    event: {
      txDigest: string;
      eventSeq: string;
    };
    endEpoch: number;
  };
}

export class WalrusClient {
  private config: WalrusConfig;

  constructor(config?: Partial<WalrusConfig>) {
    this.config = {
      publisherUrl: config?.publisherUrl || 
        process.env.NEXT_PUBLIC_WALRUS_PUBLISHER_URL || 
        'https://publisher.walrus-testnet.walrus.space',
      aggregatorUrl: config?.aggregatorUrl || 
        process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR_URL || 
        'https://aggregator.walrus-testnet.walrus.space',
      epochs: config?.epochs || 1,
    };

    console.log('🔧 Walrus Client initialized:', {
      publisher: this.config.publisherUrl,
      aggregator: this.config.aggregatorUrl,
    });
  }

  /**
   * Upload a blob to Walrus storage
   * Tries multiple endpoint formats for compatibility
   */
  async upload(
    data: Blob | File | ArrayBuffer | Uint8Array,
    options?: {
      epochs?: number;
      force?: boolean;
    }
  ): Promise<WalrusUploadResult> {
    console.log('📤 Uploading to Walrus...', {
      size: data instanceof Blob ? data.size : data.byteLength,
      type: data instanceof Blob ? data.type : 'binary',
    });

    // Convert to Blob if necessary
    let blob: Blob;
    if (data instanceof Blob) {
      blob = data;
    } else if (data instanceof ArrayBuffer) {
      blob = new Blob([data]);
    } else if (data instanceof Uint8Array) {
      // Create a new Uint8Array to ensure proper typing
      const uint8Array = new Uint8Array(data);
      blob = new Blob([uint8Array]);
    } else {
      throw new Error('Unsupported data type for upload');
    }

    const epochs = options?.epochs || this.config.epochs;

    // Try different endpoint formats
    const endpoints = [
      `${this.config.publisherUrl}/v1/store?epochs=${epochs}`,
      `${this.config.publisherUrl}/store?epochs=${epochs}`,
      `${this.config.publisherUrl}/v1/store`,
      `${this.config.publisherUrl}/store`,
    ];

    let lastError: Error | null = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Trying endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'PUT',
          body: blob,
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`⚠️  Endpoint ${endpoint} returned ${response.status}: ${errorText}`);
          lastError = new Error(`HTTP ${response.status}: ${errorText}`);
          continue;
        }

        const result: WalrusUploadResponse = await response.json();
        console.log('✅ Upload successful!', result);

        // Parse response - handle both newly created and already certified
        let blobId: string;
        let suiRefObject: string | undefined;
        let endEpoch: number | undefined;

        if (result.newlyCreated) {
          blobId = result.newlyCreated.blobObject.blobId;
          suiRefObject = result.newlyCreated.blobObject.id;
          endEpoch = result.newlyCreated.blobObject.storage.endEpoch;
          
          console.log('📦 New blob created:', {
            blobId: blobId.substring(0, 20) + '...',
            suiRef: suiRefObject.substring(0, 20) + '...',
            size: result.newlyCreated.blobObject.size,
            cost: result.newlyCreated.cost,
            endEpoch,
          });
        } else if (result.alreadyCertified) {
          blobId = result.alreadyCertified.blobId;
          endEpoch = result.alreadyCertified.endEpoch;
          
          console.log('♻️  Blob already certified:', {
            blobId: blobId.substring(0, 20) + '...',
            txDigest: result.alreadyCertified.event.txDigest,
            endEpoch,
          });
        } else {
          throw new Error('Unexpected response format from Walrus');
        }

        return {
          blobId,
          size: blob.size,
          uploadedAt: new Date().toISOString(),
          suiRefObject,
          endEpoch,
        };
      } catch (error) {
        console.warn(`❌ Endpoint ${endpoint} failed:`, error);
        lastError = error as Error;
        continue;
      }
    }

    // All endpoints failed
    console.error('❌ All Walrus endpoints failed');
    throw new Error(`Walrus upload failed: ${lastError?.message || 'All endpoints unavailable'}`);
  }

  /**
   * Download a blob from Walrus storage
   */
  async download(blobId: string): Promise<Blob> {
    console.log('📥 Downloading from Walrus:', blobId);

    const endpoints = [
      `${this.config.aggregatorUrl}/v1/${blobId}`,
      `${this.config.aggregatorUrl}/${blobId}`,
    ];

    let lastError: Error | null = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Trying endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint);

        if (!response.ok) {
          console.warn(`⚠️  Endpoint ${endpoint} returned ${response.status}`);
          lastError = new Error(`HTTP ${response.status}`);
          continue;
        }

        const blob = await response.blob();
        
        console.log('✅ Download successful:', {
          blobId: blobId.substring(0, 20) + '...',
          size: blob.size,
          type: blob.type,
        });

        return blob;
      } catch (error) {
        console.warn(`❌ Endpoint ${endpoint} failed:`, error);
        lastError = error as Error;
        continue;
      }
    }

    throw new Error(`Walrus download failed: ${lastError?.message || 'All endpoints unavailable'}`);
  }

  /**
   * Check if a blob exists on Walrus
   */
  async exists(blobId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.config.aggregatorUrl}/v1/${blobId}`,
        { method: 'HEAD' }
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get blob metadata
   */
  async getMetadata(blobId: string): Promise<{
    exists: boolean;
    size?: number;
    contentType?: string;
  }> {
    try {
      const response = await fetch(
        `${this.config.aggregatorUrl}/v1/${blobId}`,
        { method: 'HEAD' }
      );

      if (!response.ok) {
        return { exists: false };
      }

      const size = response.headers.get('content-length');
      const contentType = response.headers.get('content-type');

      return {
        exists: true,
        size: size ? parseInt(size, 10) : undefined,
        contentType: contentType || undefined,
      };
    } catch (error) {
      return { exists: false };
    }
  }
}

// Export singleton instance
export const walrusClient = new WalrusClient();

// Export convenience functions
export async function uploadToWalrus(
  data: Blob | File | ArrayBuffer | Uint8Array,
  options?: { epochs?: number }
): Promise<WalrusUploadResult> {
  return walrusClient.upload(data, options);
}

export async function downloadFromWalrus(blobId: string): Promise<Blob> {
  return walrusClient.download(blobId);
}

export async function checkBlobExists(blobId: string): Promise<boolean> {
  return walrusClient.exists(blobId);
}

export async function getBlobMetadata(blobId: string) {
  return walrusClient.getMetadata(blobId);
}
