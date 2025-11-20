declare module 'crypto-browserify' {
  export function randomBytes(size: number): Buffer;
  export function createCipheriv(algorithm: string, key: Buffer, iv: Buffer): any;
  export function createDecipheriv(algorithm: string, key: Buffer, iv: Buffer): any;
  export function createHash(algorithm: string): {
    update(data: string | Buffer): any;
    digest(encoding: string): string;
  };
  
  const crypto: {
    randomBytes: typeof randomBytes;
    createCipheriv: typeof createCipheriv;
    createDecipheriv: typeof createDecipheriv;
    createHash: typeof createHash;
  };
  
  export default crypto;
}
