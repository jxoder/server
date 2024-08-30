import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { ApiSwagger, OkResponse } from '@slibs/api'
import { EmailAccountService, UserJWTUtils } from '@slibs/user'
import { LoginWithEmailPayload, SignWithEmailPayload } from '../payload'
import { SignedUserResponse } from '../response'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Email account')
@Controller({ path: 'email-account' })
export class EmailAccountController {
  constructor(private readonly emailAccountService: EmailAccountService) {}

  @Post('sign')
  @HttpCode(200)
  @ApiSwagger({ type: OkResponse, summary: 'sign with email' })
  async sign(@Body() payload: SignWithEmailPayload): Promise<OkResponse> {
    await this.emailAccountService.sign(payload)

    return { ok: 1 }
  }

  @Post('login')
  @HttpCode(200)
  @ApiSwagger({ type: SignedUserResponse, summary: 'login with email' })
  async login(
    @Body() payload: LoginWithEmailPayload,
  ): Promise<SignedUserResponse> {
    const user = await this.emailAccountService.login(payload)
    const accessToken = await UserJWTUtils.sign({ id: user.id })

    return { user, accessToken }
  }
}
