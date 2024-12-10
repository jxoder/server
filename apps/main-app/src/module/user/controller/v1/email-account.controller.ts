import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ParseOptionalIntPipe } from '@slibs/api'
import {
  BearerAuthorized,
  EmailAccount,
  EmailAccountService,
  USER_ROLE,
} from '@slibs/user'
import { EmailAccountListResponse } from '../../model/email-account.response'

@ApiTags('Email Accounts')
@Controller({ path: 'email-accounts', version: '1' })
export class EmailAccountControllerV1 {
  constructor(private readonly emailAccountService: EmailAccountService) {}

  @Get()
  @BearerAuthorized(USER_ROLE.ADMIN)
  @ApiOperation({ summary: 'email account list' })
  @ApiResponse({ type: EmailAccountListResponse })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'email', required: false })
  async list(
    @Query('page', new ParseOptionalIntPipe(1)) page: number,
    @Query('size', new ParseOptionalIntPipe(10)) size: number,
    @Query('email') email?: string,
  ) {
    const [emailAccounts, total] = await this.emailAccountService.list({
      pageOpt: { page, size },
      decorator: qb => {
        if (email && email.trim().length > 0) {
          qb.andWhere(`${qb.alias}.email LIKE :email`, {
            email: `${email}%`,
          })
        }
      },
    })

    return { list: emailAccounts, page, size, total }
  }

  @Get(':id')
  @BearerAuthorized(USER_ROLE.ADMIN)
  @ApiOperation({ summary: 'email account info' })
  @ApiResponse({ type: EmailAccount })
  async get(@Param('id', new ParseIntPipe()) id: number) {
    return this.emailAccountService.read(id)
  }
}
