export enum ERROR_CODE {
  FATAL = -1,

  UNAUTHORIZED = 401,

  // Common Error
  NO_UPDATE = 1_000,
  NOT_FOUND = 1_001,
  DUPLICATED = 1_002,
  REQUIRED_FIELD = 1_003,

  // User Error
  INVALID_LOGIN_INFO = 10_000,
}