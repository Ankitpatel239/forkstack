import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
// Ensure ENCRYPTION_KEY is 64 hex characters (32 bytes) in .env
const envKey = process.env.ENCRYPTION_KEY || '0000000000000000000000000000000000000000000000000000000000000000';
const key = Buffer.from(envKey, 'hex');
const ivLength = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
