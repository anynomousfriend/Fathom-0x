/**
 * Mock Walrus implementation for demo purposes
 * Use this when Walrus testnet is unavailable
 */

export interface WalrusUploadResult {
  blobId: string;
  size: number;
  uploadedAt: string;
}

/**
 * Generate a realistic-looking Blob ID
 */
function generateMockBlobId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < 43; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Mock upload to simulate Walrus behavior
 * Returns a realistic Blob ID
 */
export async function uploadToWalrusMock(
  data: Blob,
  metadata?: Record<string, string>
): Promise<WalrusUploadResult> {
  console.log('📤 Mock Walrus Upload (Testnet unavailable)...', {
    size: data.size,
    type: data.type
  });

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  // Generate realistic blob ID
  const blobId = generateMockBlobId();

  console.log('✅ Mock upload successful!', {
    blobId: blobId.substring(0, 20) + '...',
    size: data.size,
    note: 'Using mock mode - Walrus testnet unavailable'
  });

  console.warn('⚠️  MOCK MODE: Walrus testnet is unavailable. Using simulated Blob ID.');
  console.warn('    In production, this would be a real Walrus upload.');

  return {
    blobId,
    size: data.size,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Mock retrieval (not used in demo but included for completeness)
 */
export async function retrieveFromWalrusMock(blobId: string): Promise<Blob> {
  console.log('📥 Mock Walrus Retrieval:', blobId);
  
  // Return empty blob as placeholder
  return new Blob(['Mock data'], { type: 'application/octet-stream' });
}

/**
 * Check if blob exists (mock always returns true)
 */
export async function checkBlobExistsMock(blobId: string): Promise<boolean> {
  return true;
}
