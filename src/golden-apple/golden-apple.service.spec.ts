import { Test, TestingModule } from '@nestjs/testing';
import { GoldenAppleService } from './golden-apple.service';

describe('GoldenAppleService', () => {
  let service: GoldenAppleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoldenAppleService],
    }).compile();

    service = module.get<GoldenAppleService>(GoldenAppleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
