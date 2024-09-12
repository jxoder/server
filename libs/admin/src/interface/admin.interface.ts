import { USER_ROLE } from '@slibs/user'
import { CurrentAdmin, ResourceWithOptions } from 'adminjs'

export interface IAdminUser extends CurrentAdmin {
  role: USER_ROLE
  roleLv: number
}

export interface IAdminResourceOptions {
  option: ResourceWithOptions
  order: number // 노출 순서.
}
