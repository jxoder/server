import { EmailAccount } from '@slibs/user'
import { IAdminResourceOptions } from '../interface'
import { registerComponent } from '../components'
import { CryptoUtils } from '@slibs/common'

export const EmailAccountAdminoOptions: IAdminResourceOptions = {
  order: 3,
  option: {
    resource: EmailAccount,
    options: {
      navigation: { name: '사용자', icon: 'Email' },
      sort: {
        direction: 'desc',
        sortBy: 'id',
      },
      listProperties: ['id', 'email', 'loggedAt', 'userId'],
      showProperties: [
        'id',
        'email',
        'userId',
        'loggedAt',
        'createdAt',
        'updatedAt',
      ],
      editProperties: ['showEmail', 'newPassword', 'userId'],

      properties: {
        showEmail: {
          components: {
            edit: registerComponent('SHOW_EMAIL', 'EmailAccount/ShowEmail.tsx'),
          },
        },
        newPassword: {
          type: 'password',
          isVisible: { edit: true },
        },
      },
      actions: {
        edit: {
          before: [
            async (request, _context) => {
              if (request.method === 'get') return request

              if (request.payload?.newPassword) {
                request.payload.password = await CryptoUtils.genSaltedStr(
                  request.payload.newPassword,
                )
              }

              return request
            },
          ],
        },
      },
    },
  },
}
