/**
 * Vault Manager
 * Enterprise-grade secret management with encryption
 * @module lib/security/VaultManager
 */

import crypto from 'crypto';
import { Logger } from '../monitoring/Logger';

/**
 * Encryption configuration
 */
interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
  saltLength: number;
  tagLength: number;
  iterations: number;
}

/**
 * Encrypted data structure
 */
interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
  salt: string;
  algorithm: string;
  version: number;
}

/**
 * Key rotation configuration
 */
interface KeyRotationConfig {
  enabled: boolean;
  intervalDays: number;
  keepOldKeys: number;
}

/**
 * Enterprise Vault Manager
 * Handles encryption, decryption, and secure storage of sensitive data
 */
export class VaultManager {
  private static instance: VaultManager;
  private readonly logger: Logger;
  private readonly config: EncryptionConfig;
  private readonly keyRotationConfig: KeyRotationConfig;
  private masterKey: Buffer;
  private keyVersion: number = 1;
  private oldKeys: Map<number, Buffer> = new Map();
  private keyRotationInterval?: NodeJS.Timeout;

  private constructor() {
    this.logger = Logger.getInstance();

    this.config = {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
      ivLength: 16,
      saltLength: 64,
      tagLength: 16,
      iterations: 100000,
    };

    this.keyRotationConfig = {
      enabled: process.env.ENABLE_KEY_ROTATION === 'true',
      intervalDays: parseInt(process.env.KEY_ROTATION_DAYS || '90'),
      keepOldKeys: parseInt(process.env.KEEP_OLD_KEYS || '3'),
    };

    // Initialize master key
    this.masterKey = this.initializeMasterKey();

    // Start key rotation if enabled
    if (this.keyRotationConfig.enabled) {
      this.startKeyRotation();
    }

    this.logger.info('Vault Manager initialized', {
      algorithm: this.config.algorithm,
      keyRotation: this.keyRotationConfig.enabled,
    });
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): VaultManager {
    if (!VaultManager.instance) {
      VaultManager.instance = new VaultManager();
    }
    return VaultManager.instance;
  }

  /**
   * Initialize master key from environment or generate
   */
  private initializeMasterKey(): Buffer {
    const envKey = process.env.ENCRYPTION_MASTER_KEY;

    if (envKey) {
      // Use provided master key
      const key = Buffer.from(envKey, 'hex');
      if (key.length !== this.config.keyLength) {
        throw new Error(
          `Invalid master key length. Expected ${this.config.keyLength} bytes, got ${key.length}`
        );
      }
      return key;
    } else {
      // Generate new master key (for development only)
      if (process.env.NODE_ENV === 'production') {
        throw new Error('ENCRYPTION_MASTER_KEY must be set in production');
      }

      const key = crypto.randomBytes(this.config.keyLength);
      this.logger.warn('Generated new master key for development', {
        key: key.toString('hex'),
      });
      return key;
    }
  }

  /**
   * Encrypt sensitive data
   */
  public async encrypt(plaintext: string): Promise<string> {
    try {
      // Generate salt for key derivation
      const salt = crypto.randomBytes(this.config.saltLength);

      // Derive key from master key
      const key = await this.deriveKey(this.masterKey, salt);

      // Generate IV
      const iv = crypto.randomBytes(this.config.ivLength);

      // Create cipher
      const cipher = crypto.createCipheriv(this.config.algorithm, key, iv);

      // Encrypt data
      const encrypted = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final(),
      ]);

      // Get auth tag
      const tag = cipher.getAuthTag();

      // Create encrypted data object
      const encryptedData: EncryptedData = {
        encrypted: encrypted.toString('base64'),
        iv: iv.toString('base64'),
        tag: tag.toString('base64'),
        salt: salt.toString('base64'),
        algorithm: this.config.algorithm,
        version: this.keyVersion,
      };

      // Return as base64 encoded JSON
      return Buffer.from(JSON.stringify(encryptedData)).toString('base64');

    } catch (error) {
      this.logger.error('Encryption failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt sensitive data
   */
  public async decrypt(encryptedString: string): Promise<string> {
    try {
      // Parse encrypted data
      const encryptedData: EncryptedData = JSON.parse(
        Buffer.from(encryptedString, 'base64').toString('utf8')
      );

      // Get appropriate key based on version
      const masterKey = this.getKeyForVersion(encryptedData.version);

      // Derive key from master key
      const salt = Buffer.from(encryptedData.salt, 'base64');
      const key = await this.deriveKey(masterKey, salt);

      // Create decipher
      const decipher = crypto.createDecipheriv(
        encryptedData.algorithm,
        key,
        Buffer.from(encryptedData.iv, 'base64')
      );

      // Set auth tag
      decipher.setAuthTag(Buffer.from(encryptedData.tag, 'base64'));

      // Decrypt data
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData.encrypted, 'base64')),
        decipher.final(),
      ]);

      return decrypted.toString('utf8');

    } catch (error) {
      this.logger.error('Decryption failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Hash a password using bcrypt-compatible method
   */
  public async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16);
    const iterations = 100000;
    const keyLength = 32;

    const hash = crypto.pbkdf2Sync(
      password,
      salt,
      iterations,
      keyLength,
      'sha256'
    );

    const combined = Buffer.concat([
      Buffer.from([iterations >> 16, iterations >> 8, iterations]),
      salt,
      hash,
    ]);

    return combined.toString('base64');
  }

  /**
   * Verify a hashed password
   */
  public async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      const combined = Buffer.from(hash, 'base64');

      const iterations = (combined[0] << 16) | (combined[1] << 8) | combined[2];
      const salt = combined.slice(3, 19);
      const originalHash = combined.slice(19);

      const newHash = crypto.pbkdf2Sync(
        password,
        salt,
        iterations,
        32,
        'sha256'
      );

      return crypto.timingSafeEqual(originalHash, newHash);
    } catch (error) {
      return false;
    }
  }

  /**
   * Derive key from master key and salt
   */
  private async deriveKey(masterKey: Buffer, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        masterKey,
        salt,
        this.config.iterations,
        this.config.keyLength,
        'sha256',
        (err, derivedKey) => {
          if (err) reject(err);
          else resolve(derivedKey);
        }
      );
    });
  }

  /**
   * Get key for specific version
   */
  private getKeyForVersion(version: number): Buffer {
    if (version === this.keyVersion) {
      return this.masterKey;
    }

    const oldKey = this.oldKeys.get(version);
    if (!oldKey) {
      throw new Error(`Key version ${version} not found`);
    }

    return oldKey;
  }

  /**
   * Rotate encryption keys
   */
  public async rotateKeys(): Promise<void> {
    this.logger.info('Starting key rotation');

    try {
      // Store old key
      this.oldKeys.set(this.keyVersion, this.masterKey);

      // Limit old keys
      if (this.oldKeys.size > this.keyRotationConfig.keepOldKeys) {
        const oldestVersion = Math.min(...this.oldKeys.keys());
        this.oldKeys.delete(oldestVersion);
      }

      // Generate new master key
      this.masterKey = crypto.randomBytes(this.config.keyLength);
      this.keyVersion++;

      // Store new key securely (in production, this would be stored in a secure key management service)
      if (process.env.NODE_ENV === 'production') {
        // TODO: Store in AWS KMS, Azure Key Vault, or similar
        this.logger.warn('Key rotation in production requires external key management');
      }

      this.logger.info('Key rotation completed', {
        newVersion: this.keyVersion,
        oldKeysStored: this.oldKeys.size,
      });

    } catch (error) {
      this.logger.error('Key rotation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Start automatic key rotation
   */
  private startKeyRotation(): void {
    const intervalMs = this.keyRotationConfig.intervalDays * 24 * 60 * 60 * 1000;

    this.keyRotationInterval = setInterval(async () => {
      await this.rotateKeys();
    }, intervalMs);

    this.logger.info('Key rotation scheduled', {
      intervalDays: this.keyRotationConfig.intervalDays,
    });
  }

  /**
   * Stop key rotation
   */
  public stopKeyRotation(): void {
    if (this.keyRotationInterval) {
      clearInterval(this.keyRotationInterval);
      this.logger.info('Key rotation stopped');
    }
  }

  /**
   * Generate secure random token
   */
  public generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate UUID v4
   */
  public generateUUID(): string {
    return crypto.randomUUID();
  }

  /**
   * Create HMAC signature
   */
  public createHMAC(data: string, secret?: string): string {
    const key = secret || this.masterKey.toString('hex');
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data);
    return hmac.digest('hex');
  }

  /**
   * Verify HMAC signature
   */
  public verifyHMAC(data: string, signature: string, secret?: string): boolean {
    const expectedSignature = this.createHMAC(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Sanitize connection string
   */
  public sanitizeConnectionString(connectionString: string): string {
    // Remove sensitive information from connection strings for logging
    return connectionString
      .replace(/password=([^;]*)/gi, 'password=***')
      .replace(/pwd=([^;]*)/gi, 'pwd=***')
      .replace(/apikey=([^;]*)/gi, 'apikey=***')
      .replace(/secret=([^;]*)/gi, 'secret=***')
      .replace(/:([^:@]+)@/g, ':***@'); // MongoDB style
  }

  /**
   * Validate and sanitize SQL input
   */
  public sanitizeSQLInput(input: string): string {
    // Basic SQL injection prevention
    return input
      .replace(/'/g, "''")
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '')
      .replace(/xp_/gi, '')
      .replace(/exec/gi, '')
      .replace(/drop/gi, '')
      .replace(/union/gi, '');
  }

  /**
   * Check if a value appears to be encrypted
   */
  public isEncrypted(value: string): boolean {
    try {
      const decoded = Buffer.from(value, 'base64').toString('utf8');
      const parsed = JSON.parse(decoded);
      return (
        parsed.encrypted &&
        parsed.iv &&
        parsed.tag &&
        parsed.salt &&
        parsed.algorithm &&
        parsed.version
      );
    } catch {
      return false;
    }
  }

  /**
   * Securely wipe sensitive data from memory
   */
  public wipeMemory(buffer: Buffer): void {
    crypto.randomFillSync(buffer);
    buffer.fill(0);
  }

  /**
   * Shutdown vault manager
   */
  public shutdown(): void {
    this.stopKeyRotation();
    this.wipeMemory(this.masterKey);
    for (const key of this.oldKeys.values()) {
      this.wipeMemory(key);
    }
    this.oldKeys.clear();
    this.logger.info('Vault Manager shutdown complete');
  }
}