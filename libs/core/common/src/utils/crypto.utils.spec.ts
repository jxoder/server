import { CryptoUtils } from './crypto.utils'

describe('crypto.utils', () => {
  it('encodeAES & decodeAES', () => {
    const secret = 'secret'
    const str = 'test'
    const encoded = CryptoUtils.encodeAES(str, secret)
    const decoded = CryptoUtils.decodeAES(encoded, secret)

    expect(decoded).toBe(str)
  })
})
