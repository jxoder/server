import { get } from 'env-var'

export class SwaggerConfig {
  static readonly SWAGGER_ENABLED = get('SWAGGER_ENABLED')
    .default('false')
    .asBool()
  static readonly SWAGGER_TITLE = get('SWAGGER_TITLE')
    .default('Local API')
    .asString()
  static readonly SWAGGER_DESCRIPTION = get('SWAGGER_DESCRIPTION')
    .default('Local API Description')
    .asString()
  static readonly SWAGGER_VERSION = get('SWAGGER_VERSION')
    .default('0.0.1')
    .asString()
}
