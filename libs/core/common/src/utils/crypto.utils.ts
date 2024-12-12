import * as bcrypt from 'bcrypt'
import crypto from 'crypto'

export class CryptoUtils {
  static async genSaltedStr(str: string, iteration = 10): Promise<string> {
    const salt = await bcrypt.genSalt(iteration)
    return bcrypt.hash(str, salt)
  }

  static async compareSalted(str: string, salted: string): Promise<boolean> {
    return bcrypt.compare(str, salted)
  }

  static encodeBase64(str: string): string {
    return Buffer.from(str).toString('base64')
  }

  static encodeAES(str: string, secret: string): string {
    const secret32 = secret.repeat(Math.ceil(32 / secret.length)).slice(0, 32)
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', secret32, iv)
    let encrypted = cipher.update(str, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return `${iv.toString('hex')}:${encrypted}`
  }

  static decodeAES(str: string, secret: string): string {
    const secret32 = secret.repeat(Math.ceil(32 / secret.length)).slice(0, 32)
    const [iv, encrypted] = str.split(':')
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      secret32,
      Buffer.from(iv, 'hex'),
    )
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
}
