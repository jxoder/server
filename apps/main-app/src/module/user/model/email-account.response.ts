import { ApiProperty } from '@nestjs/swagger'
import { EmailAccount } from '@slibs/user'
import { ListResponseBase } from '../../common'

export class EmailAccountListResponse extends ListResponseBase {
  @ApiProperty({ type: [EmailAccount], description: 'email accounts' })
  list: EmailAccount[]
}
