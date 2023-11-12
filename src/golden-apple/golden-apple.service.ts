import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FetchProduct } from '@src/golden-apple-parser/types';
import { GoldenAppleProduct } from '@src/schemas/golden-apple.schema';
import { Model } from 'mongoose';
import { GoldenAppleParserService } from '@src/golden-apple-parser/golden-apple-parser.service';

@Injectable()
export class GoldenAppleService {
  private readonly logger = new Logger(GoldenAppleService.name);

  constructor(
    @InjectModel(GoldenAppleProduct.name)
    private productModel: Model<GoldenAppleProduct>,
    protected readonly goldenAppleParserService: GoldenAppleParserService,
  ) {}

  async saveFetchProduct(fetchProduct: FetchProduct): Promise<{
    product: GoldenAppleProduct;
    type: 'new' | 'updated' | 'notUpdated';
  }> {
    const product = await this.productModel.findOne({
      itemId: fetchProduct.itemId,
    });
    if (!product) {
      const newProduct = await this.productModel.create({
        ...fetchProduct,
        priceHistory: [
          {
            price: fetchProduct.price.actual,
          },
        ],
      });
      return {
        product: newProduct.toObject(),
        type: 'new',
      };
    }

    if (product.price.actual !== fetchProduct.price.actual) {
      product.priceHistory.push({
        price: fetchProduct.price.actual,
        d: new Date(),
      });
      product.price = fetchProduct.price;
      await product.save();

      return {
        product: product.toObject(),
        type: 'updated',
      };
    }

    return {
      product: product.toObject(),
      type: 'notUpdated',
    };
  }

  async saveFetchProducts(products: FetchProduct[]) {
    const res = await this.productModel.insertMany(products, {
      rawResult: true,
    });
    this.logger.debug(res);
  }

  async getProductImageUrlsByItemId(itemId: string): Promise<string[]> {
    const product = await this.productModel
      .findOne({ itemId }, ['imageUrls'])
      .lean();

    return product.imageUrls;
  }
  async getProductPriceHistoryByItemId(
    itemId: string,
  ): Promise<GoldenAppleProduct['priceHistory']> {
    const product = await this.productModel
      .findOne({ itemId }, ['priceHistory'])
      .lean();

    return product.priceHistory;
  }

  async getDescriptionByItemId(itemId: string): Promise<string> {
    const product = await this.productModel
      .findOne({ itemId }, ['description'])
      .lean();
    if (product.description) return product.description;
    const description =
      await this.goldenAppleParserService.fetchDescriptionByItemId(itemId);
    const res = await this.productModel.updateOne({ itemId }, { description });
    console.log(res);

    return description;
  }
}
