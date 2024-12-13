import ping from 'ping'

export class PingUtils {
  static async ping(host: string, timeout = 1, interval = 3): Promise<boolean> {
    const res = await ping.promise.probe(host, {
      timeout,
      extra: ['-i', interval.toString()],
    })

    if (['unknown', 'cannot'].includes(res.host)) {
      throw new Error(`ping failed: ${host}, message: ${res.output}`)
    }
    return res.alive
  }
}
