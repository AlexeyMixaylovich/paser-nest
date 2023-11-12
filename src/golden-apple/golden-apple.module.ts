import { Module } from '@nestjs/common';
import { GoldenAppleService } from './golden-apple.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GoldenAppleProduct,
  GoldenAppleProductSchema,
} from '@src/schemas/golden-apple.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GoldenAppleProduct.name,
        schema: GoldenAppleProductSchema,
      },
    ]),
  ],
  providers: [GoldenAppleService],
  exports: [GoldenAppleService],
})
export class GoldenAppleModule {}
