import { Module } from '@nestjs/common';

import { GoldenAppleParserService } from './golden-apple-parser.service';

@Module({
  exports: [GoldenAppleParserService],
  providers: [GoldenAppleParserService],
})
export class GoldenAppleParserModule {}
