import { Module } from '@nestjs/common';
import { GoldenAppleModule } from '@src/golden-apple/golden-apple.module';

@Module({
  imports: [GoldenAppleModule],
})
export class GoldenAppleParserModule {}
