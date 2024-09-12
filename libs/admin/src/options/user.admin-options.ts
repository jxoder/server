import { User } from '@slibs/user'
import { IAdminResourceOptions } from '../interface'

export const UserAdminOptions: IAdminResourceOptions = {
  order: 1,
  option: {
    resource: User,
    options: {
      navigation: { name: '사용자', icon: 'User' },
      sort: {
        direction: 'desc',
        sortBy: 'id',
      },
      listProperties: ['id', 'name', 'role', 'createdAt'],
      editProperties: ['name', 'role'],
      showProperties: ['id', 'name', 'role', 'createdAt', 'updatedAt'],
    },
  },
}
