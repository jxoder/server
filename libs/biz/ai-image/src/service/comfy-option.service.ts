import { Injectable } from '@nestjs/common'
import { ComfyModelRepository } from '../repository'
import { FindOptionsWhere } from 'typeorm'
import { ComfyModel } from '../entities'

@Injectable()
export class ComfyOptionService {
  constructor(private readonly comfyModelRepository: ComfyModelRepository) {}

  async getComfyModels(where: FindOptionsWhere<ComfyModel>) {
    return this.comfyModelRepository.findBy(where)
  }
}
