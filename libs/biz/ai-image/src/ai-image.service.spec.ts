import { Test, TestingModule } from '@nestjs/testing';
import { AiImageService } from './ai-image.service';

describe('AiImageService', () => {
  let service: AiImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiImageService],
    }).compile();

    service = module.get<AiImageService>(AiImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
