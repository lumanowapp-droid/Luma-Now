import crypto from 'crypto'

export interface EncryptionConfig {
  algorithm: string
  keyLength: number
  ivLength: number
  tagLength: number
}

export interface EncryptedData {
  encrypted: string
  iv: string
  tag: string
  algorithm: string
}

export interface DataClassification {
  type: 'public' | 'internal' | 'confidential' | 'restricted'
  pii: boolean
  phi: boolean
  financial: boolean
  requiresEncryption: boolean
}

export class EncryptionService {
  private static instance: EncryptionService
  private config: EncryptionConfig = {
    algorithm: 'aes-256-cbc',
    keyLength: 32,
    ivLength: 16,
    tagLength: 16
  }

  // Data classification mappings
  private static dataClassifications: Record<string, DataClassification> = {
    // PII Data
    'email': { type: 'confidential', pii: true, phi: false, financial: false, requiresEncryption: true },
    'phone': { type: 'confidential', pii: true, phi: false, financial: false, requiresEncryption: true },
    'full_name': { type: 'confidential', pii: true, phi: false, financial: false, requiresEncryption: true },
    'address': { type: 'restricted', pii: true, phi: false, financial: false, requiresEncryption: true },
    'ssn': { type: 'restricted', pii: true, phi: false, financial: true, requiresEncryption: true },
    'credit_card': { type: 'restricted', pii: false, phi: false, financial: true, requiresEncryption: true },
    
    // PHI Data (Healthcare)
    'medical_record': { type: 'restricted', pii: true, phi: true, financial: false, requiresEncryption: true },
    'diagnosis': { type: 'restricted', pii: true, phi: true, financial: false, requiresEncryption: true },
    'prescription': { type: 'restricted', pii: true, phi: true, financial: false, requiresEncryption: true },
    
    // Financial Data
    'bank_account': { type: 'restricted', pii: false, phi: false, financial: true, requiresEncryption: true },
    'routing_number': { type: 'restricted', pii: false, phi: false, financial: true, requiresEncryption: true },
    'account_balance': { type: 'confidential', pii: false, phi: false, financial: true, requiresEncryption: true },
    
    // Internal Data
    'api_key': { type: 'confidential', pii: false, phi: false, financial: false, requiresEncryption: true },
    'password': { type: 'restricted', pii: false, phi: false, financial: false, requiresEncryption: true },
    'refresh_token': { type: 'restricted', pii: false, phi: false, financial: false, requiresEncryption: true },
    
    // Public Data (no encryption needed)
    'username': { type: 'internal', pii: true, phi: false, financial: false, requiresEncryption: false },
    'avatar_url': { type: 'public', pii: false, phi: false, financial: false, requiresEncryption: false },
    'created_at': { type: 'internal', pii: false, phi: false, financial: false, requiresEncryption: false }
  }

  private constructor() {}

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService()
    }
    return EncryptionService.instance
  }

  /**
   * Generate a cryptographically secure key
   */
  generateKey(): string {
    return crypto.randomBytes(this.config.keyLength).toString('hex')
  }

  /**
   * Encrypt data using AES-256-CBC with createCipheriv
   */
  encrypt(data: string, key?: string): EncryptedData {
    const encryptionKey = key ? Buffer.from(key, 'hex') : crypto.randomBytes(this.config.keyLength)
    const iv = crypto.randomBytes(this.config.ivLength)
    
    const cipher = crypto.createCipheriv(this.config.algorithm, encryptionKey, iv)
    
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: '', // Not used in CBC mode
      algorithm: this.config.algorithm
    }
  }

  /**
   * Decrypt data using AES-256-CBC with createDecipheriv
   */
  decrypt(encryptedData: EncryptedData, key?: string): string {
    const encryptionKey = key ? Buffer.from(key, 'hex') : crypto.randomBytes(this.config.keyLength)
    const iv = Buffer.from(encryptedData.iv, 'hex')
    
    const decipher = crypto.createDecipheriv(encryptedData.algorithm, encryptionKey, iv)
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }

  /**
   * Hash password using bcrypt-like approach with salt
   */
  hashPassword(password: string, saltRounds = 12): { hash: string; salt: string } {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
    
    return { hash, salt }
  }

  /**
   * Verify password against hash
   */
  verifyPassword(password: string, hash: string, salt: string): boolean {
    const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedHash, 'hex'))
  }

  /**
   * Generate secure random tokens
   */
  generateSecureToken(length = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  /**
   * Generate API key with prefix for identification
   */
  generateAPIKey(prefix = 'sk'): { key: string; keyHash: string; keyPrefix: string } {
    const key = `${prefix}_${this.generateSecureToken(48)}`
    const keyHash = crypto.createHash('sha256').update(key).digest('hex')
    const keyPrefix = key.substring(0, prefix.length + 3) // prefix + first 3 chars
    
    return { key, keyHash, keyPrefix }
  }

  /**
   * Check if field requires encryption based on data classification
   */
  requiresEncryption(fieldName: string): boolean {
    const classification = (EncryptionService as any).dataClassifications[fieldName]
    return classification?.requiresEncryption || false
  }

  /**
   * Get data classification for field
   */
  getDataClassification(fieldName: string): DataClassification {
    return (EncryptionService as any).dataClassifications[fieldName] || {
      type: 'internal',
      pii: false,
      phi: false,
      financial: false,
      requiresEncryption: false
    }
  }

  /**
   * Encrypt sensitive fields in an object
   */
  encryptObjectFields<T extends Record<string, any>>(obj: T, fields: string[], key?: string): T {
    const encryptedObj = { ...obj }
    
    for (const field of fields) {
      if (encryptedObj[field] && this.requiresEncryption(field)) {
        const encryptedData = this.encrypt(String(encryptedObj[field]), key)
        ;(encryptedObj as any)[field] = encryptedData
      }
    }
    
    return encryptedObj
  }

  /**
   * Decrypt sensitive fields in an object
   */
  decryptObjectFields<T extends Record<string, any>>(obj: T, fields: string[], key?: string): T {
    const decryptedObj = { ...obj }
    
    for (const field of fields) {
      if (decryptedObj[field] && typeof decryptedObj[field] === 'object' && 'encrypted' in (decryptedObj as any)[field]) {
        const decryptedValue = this.decrypt((decryptedObj as any)[field] as EncryptedData, key)
        ;(decryptedObj as any)[field] = decryptedValue
      }
    }
    
    return decryptedObj
  }

  /**
   * Mask sensitive data for logging (GDPR compliance)
   */
  maskSensitiveData(data: any, fields: string[] = ['email', 'phone', 'ssn', 'credit_card']): any {
    if (typeof data !== 'object' || data === null) {
      return data
    }

    const masked = Array.isArray(data) ? [...data] : { ...data }
    
    for (const field of fields) {
      if ((masked as any)[field]) {
        const value = String((masked as any)[field])
        if (field === 'email') {
          const [local, domain] = value.split('@')
          ;(masked as any)[field] = `${local.substring(0, 2)}***@${domain}`
        } else if (field === 'phone') {
          ;(masked as any)[field] = `***-***-${value.slice(-4)}`
        } else if (field === 'ssn') {
          ;(masked as any)[field] = `***-**-${value.slice(-4)}`
        } else if (field === 'credit_card') {
          ;(masked as any)[field] = `**** **** **** ${value.slice(-4)}`
        } else {
          ;(masked as any)[field] = '*'.repeat(Math.min(value.length, 8))
        }
      }
    }
    
    return masked
  }

  /**
   * Generate audit hash for data integrity verification
   */
  generateAuditHash(data: any): string {
    const dataString = JSON.stringify(data, Object.keys(data).sort())
    return crypto.createHash('sha256').update(dataString).digest('hex')
  }

  /**
   * Verify data integrity using audit hash
   */
  verifyAuditHash(data: any, auditHash: string): boolean {
    const computedHash = this.generateAuditHash(data)
    return crypto.timingSafeEqual(
      Buffer.from(computedHash, 'hex'),
      Buffer.from(auditHash, 'hex')
    )
  }

  /**
   * GDPR/CCPA Compliance: Generate data export report
   */
  generateDataExportReport(userId: string, userData: any): any {
    const report = {
      user_id: userId,
      export_date: new Date().toISOString(),
      data_categories: {},
      pii_data: {},
      phi_data: {},
      financial_data: {},
      metadata: {
        export_type: 'gdpr_ccpa_compliance',
        data_classification_version: '1.0'
      }
    }

    // Categorize data by classification
    for (const [field, value] of Object.entries(userData)) {
      const classification = this.getDataClassification(field)
      
      if (classification.pii) {
        (report.pii_data as any)[field] = this.maskSensitiveData(value, [field])
      }
      
      if (classification.phi) {
        (report.phi_data as any)[field] = this.maskSensitiveData(value, [field])
      }

      if (classification.financial) {
        (report.financial_data as any)[field] = this.maskSensitiveData(value, [field])
      }

      (report.data_categories as any)[field] = classification
    }

    return report
  }

  /**
   * GDPR/CCPA Compliance: Anonymize user data for retention
   */
  anonymizeUserData(userData: any): any {
    const anonymized = { ...userData }
    
    // Anonymize PII fields
    for (const [field, value] of Object.entries(anonymized)) {
      const classification = this.getDataClassification(field)
      
      if (classification.pii) {
        if (field === 'email') {
          const hash = crypto.createHash('md5').update(String(value)).digest('hex')
          ;(anonymized as any)[field] = `anonymized_${hash.substring(0, 8)}@anonymous.local`
        } else if (field === 'phone') {
          ;(anonymized as any)[field] = '***-***-****'
        } else if (field === 'full_name') {
          ;(anonymized as any)[field] = 'Anonymous User'
        } else {
          ;(anonymized as any)[field] = 'Anonymized'
        }
      }
    }
    
    return anonymized
  }
}

// Export singleton instance
export const encryptionService = EncryptionService.getInstance()