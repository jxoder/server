import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { EmailAccountService, JwtAuthService } from '@slibs/user'
import {
  LoginWithEmailPayload,
  SignedUserResponse,
  SignWithEmailPayload,
} from '../model'
import { OkResponse } from '../../common'

@ApiTags('Email account')
@Controller({ path: 'email-account' })
export class EmailAccountController {
  constructor(
    private readonly emailAccountService: EmailAccountService,
    private authService: JwtAuthService,
  ) {}

  @Post('sign')
  @ApiOperation({ summary: 'sign with email' })
  @ApiResponse({
    type: OkResponse,
    description: 'success response',
  })
  async sign(@Body() payload: SignWithEmailPayload): Promise<OkResponse> {
    await this.emailAccountService.sign(payload)

    return { ok: 1 }
  }

  @Post('login')
  @ApiOperation({ summary: 'login with email' })
  @ApiResponse({ type: SignedUserResponse, description: 'user info' })
  async login(
    @Body() payload: LoginWithEmailPayload,
  ): Promise<SignedUserResponse> {
    const user = await this.emailAccountService.login(payload)
    const accessToken = await this.authService.signToken({ id: user.id })

    return { user, accessToken }
  }
}
