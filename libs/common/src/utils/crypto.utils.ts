import * as bcrypt from 'bcrypt'

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
}
