import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Res,
  Session,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiExcludeController } from '@nestjs/swagger'
import { ensureIf, ERROR_CODE } from '@slibs/common'
import { Response } from 'express'
import { IRedisQueueCofig } from '../config'
import { IRedisSessionData } from '../interface'

@ApiExcludeController()
@Controller({ path: 'q' })
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  get config(): IRedisQueueCofig {
    return this.configService.get<IRedisQueueCofig>('redis-queue', {
      infer: true,
    })
  }

  @Get()
  async index(@Res() res: Response) {
    ensureIf(this.config.ENABLED_DASHBOARD, ERROR_CODE.NOT_FOUND)

    // redirect to root
    return res.redirect('/q/dashboard')
  }

  @Get('auth')
  @Render('queues/login')
  async render(@Res() res: Response, @Session() session: IRedisSessionData) {
    ensureIf(this.config.ENABLED_DASHBOARD, ERROR_CODE.NOT_FOUND)

    // if exists session, redirect to dashboard
    if (session.auth && session.auth.loggedAt) {
      return res.redirect('/q/dashboard')
    }

    return {}
  }

  @Post('auth')
  async login(
    @Res() res: Response,
    @Body() body: { username: string; password: string },
    @Session() session: IRedisSessionData,
  ) {
    ensureIf(this.config.ENABLED_DASHBOARD, ERROR_CODE.NOT_FOUND)

    const { USERNAME, PASSWORD } = this.config
    if (body.username === USERNAME && body.password === PASSWORD) {
      session.auth = { loggedAt: new Date() }
      await new Promise((resolve, reject) => {
        session.save(err => {
          if (err) return reject(err)
          return resolve(null)
        })
      })

      return res.redirect('/q/dashboard')
    }

    return res.render('queues/login', { error: 'Invalid credentials' })
  }
}
