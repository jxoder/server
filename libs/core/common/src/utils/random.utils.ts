import { v4 } from 'uuid'

export class RandomUtils {
  static uuidV4(): string {
    return v4()
  }
}
