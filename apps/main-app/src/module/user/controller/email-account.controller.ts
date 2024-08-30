import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { OkResponse } from '@slibs/api'
import { EmailAccountService, UserJWTUtils } from '@slibs/user'
import { LoginWithEmailPayload, SignWithEmailPayload } from '../payload'
import { SignedUserResponse } from '../response'

@Controller({ path: 'email-account' })
export class EmailAccountController {
  constructor(private readonly emailAccountService: EmailAccountService) {}

  @Post('sign')
  @HttpCode(200)
  async sign(@Body() payload: SignWithEmailPayload): Promise<OkResponse> {
    await this.emailAccountService.sign(payload)

    return { ok: 1 }
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() payload: LoginWithEmailPayload,
  ): Promise<SignedUserResponse> {
    const user = await this.emailAccountService.login(payload)
    const accessToken = await UserJWTUtils.sign({ id: user.id })

    return { user, accessToken }
  }
}
