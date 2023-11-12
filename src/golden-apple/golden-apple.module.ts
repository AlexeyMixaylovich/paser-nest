import { Module } from '@nestjs/common';
import { GoldenAppleService } from './golden-apple.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GoldenAppleProduct,
  GoldenAppleProductSchema,
} from '@src/schemas/golden-apple.schema';
import { GoldenAppleParserModule } from '@src/golden-apple-parser/golden-apple-parser.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GoldenAppleProduct.name,
        schema: GoldenAppleProductSchema,
      },
    ]),
    GoldenAppleParserModule,
  ],
  providers: [GoldenAppleService],
  exports: [GoldenAppleService],
})
export class GoldenAppleModule {}
