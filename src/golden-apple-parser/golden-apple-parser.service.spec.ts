import { Test, TestingModule } from '@nestjs/testing';
import { GoldenAppleParserService } from './golden-apple-parser.service';

describe('GoldenAppleParserService', () => {
  let service: GoldenAppleParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoldenAppleParserService],
    }).compile();

    service = module.get<GoldenAppleParserService>(GoldenAppleParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
