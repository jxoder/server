import { FormDataRequest as FormData } from 'nestjs-form-data'
import { ApiConsumes } from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'

export const FormDataRequest = (): ((...args: any) => void) => {
  return applyDecorators(FormData(), ApiConsumes('multipart/form-data'))
}
