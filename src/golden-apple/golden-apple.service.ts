import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FetchProduct } from '@src/golden-apple-parser/types';
import { GoldenAppleProduct } from '@src/schemas/golden-apple.schema';
import { Model } from 'mongoose';

@Injectable()
export class GoldenAppleService {
  private readonly logger = new Logger(GoldenAppleService.name);

  constructor(
    @InjectModel(GoldenAppleProduct.name)
    private productModel: Model<GoldenAppleProduct>,
  ) {}

  async saveFetchProducts(products: FetchProduct[]) {
    const res = await this.productModel.insertMany(products, {
      rawResult: true,
    });
    this.logger.debug(res);
  }
}
