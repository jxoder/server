import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ParseOptionalIntPipe } from '@slibs/api'
import { InfraInstance, InfraInstanceService } from '@slibs/infra-instance'
import { BearerAuthorized, USER_ROLE } from '@slibs/user'
import { omit } from 'lodash'
import { OkResponse } from '../../../common'
import {
  CreateInfraInstancePayload,
  InfraInstanceListResponse,
} from '../../model'

@ApiTags('Infra Instances')
@Controller({ path: 'infra-instances', version: '1' })
export class InfraInstanceControllerV1 {
  constructor(private readonly infraInstanceService: InfraInstanceService) {}

  @Get()
  @BearerAuthorized(USER_ROLE.MASTER)
  @ApiOperation({ description: 'infra instance list' })
  @ApiResponse({
    type: InfraInstanceListResponse,
    description: 'infra instance list',
  })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  async list(
    @Query('page', new ParseOptionalIntPipe(1)) page: number,
    @Query('size', new ParseOptionalIntPipe(10)) size: number,
    @Query('name') name?: string,
  ) {
    const [entities, total] = await this.infraInstanceService.list({
      pageOpt: { page, size },
      decorator: qb => {
        if (name && name.trim().length > 0) {
          qb.andWhere(`${qb.alias}.name ILIKE :name`, {
            name: `${name}%`,
          })
        }
      },
    })

    return { list: entities.map(e => omit(e, ['config'])), page, size, total }
  }

  @Get(':id')
  @BearerAuthorized(USER_ROLE.MASTER)
  @ApiResponse({ type: InfraInstance, description: 'infra instance' })
  async get(@Param('id', new ParseIntPipe()) id: number) {
    const e = await this.infraInstanceService.read(id)
    return { ...e, config: omit(e.config, ['sshPrivateKey']) }
  }

  @Post()
  @BearerAuthorized(USER_ROLE.MASTER)
  @ApiResponse({ type: InfraInstance, description: 'infra instance' })
  async create(@Body() body: CreateInfraInstancePayload) {
    return this.infraInstanceService.create(body)
  }

  @Post(':id/turn-on')
  @BearerAuthorized(USER_ROLE.ADMIN)
  @ApiResponse({ type: Boolean, description: 'turn on' })
  async turnOn(@Param('id', new ParseIntPipe()) id: number) {
    await this.infraInstanceService.turnOn(id)
    return OkResponse.ok()
  }

  @Post(':id/turn-off')
  @BearerAuthorized(USER_ROLE.ADMIN)
  @ApiResponse({ type: Boolean, description: 'turn off' })
  async turnOff(@Param('id', new ParseIntPipe()) id: number) {
    await this.infraInstanceService.turnOff(id)
    return OkResponse.ok()
  }
}
