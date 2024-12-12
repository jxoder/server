import { ApiProperty } from '@nestjs/swagger'
import { InfraInstance, INSTANCE_STATUS } from '@slibs/infra-instance'
import { ListResponseBase } from '../../common'

export class InfraInstanceListResponse extends ListResponseBase {
  @ApiProperty({ type: [InfraInstance], description: 'infra instances' })
  list: InfraInstance[]
}

export class InfraInstanceCheckOnResponse {
  @ApiProperty({
    example: INSTANCE_STATUS.UNKNOWN,
    description: 'instance status',
  })
  status: INSTANCE_STATUS
}
