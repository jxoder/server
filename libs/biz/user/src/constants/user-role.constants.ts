export enum USER_ROLE {
  ANONYMOUS = 'ANONYMOUS',
  USER = 'USER',
  ADMIN = 'ADMIN',
  MASTER = 'MASTER',
}

export const USER_ROLE_LEVEL = {
  [USER_ROLE.ANONYMOUS]: 3,
  [USER_ROLE.USER]: 5,
  [USER_ROLE.ADMIN]: 10,
  [USER_ROLE.MASTER]: 15,
}
