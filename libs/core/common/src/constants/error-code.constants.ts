export enum ERROR_CODE {
  FATAL = -1,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,

  // Common Error
  NO_UPDATE = 1_000,
  DUPLICATED = 1_001,
  REQUIRED_FIELD = 1_002,

  // User Error
  INVALID_LOGIN_INFO = 10_000,

  // Comfy Error
  COMFY_NOT_AVAILABLE = 20_000,
  COMFY_INVALID_WORKFLOW = 20_001,
}
