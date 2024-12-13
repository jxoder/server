import { PingUtils } from './ping.utils'

describe('ping.utils', () => {
  it('ping success', async () => {
    const r1 = await PingUtils.ping('8.8.8.8')
    expect(r1).toBe(true)

    const r2 = await PingUtils.ping('google.com')
    expect(r2).toBe(true)
  })

  it('ping failed', async () => {
    await expect(PingUtils.ping('invalid host')).rejects.toThrow(
      'ping failed: invalid host, message: ping: cannot resolve invalid host: Unknown host',
    )
  })
})
