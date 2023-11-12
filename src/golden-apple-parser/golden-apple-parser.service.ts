import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { sleep } from '@src/helpers/sleep';
import axios from 'axios';
import { productsUrl } from './constants/url';
import { TFilters, dataForRequestFlacon } from './constants/filters';
import { FetchProduct } from './types';
import { getFetchProduct } from './helpers/mappers';
import { GoldenAppleService } from '@src/golden-apple/golden-apple.service';

@Injectable()
export class GoldenAppleParserService {
  private readonly logger = new Logger(GoldenAppleParserService.name);

  constructor(protected readonly goldenAppleService: GoldenAppleService) {}

  @Cron('*/10 * * * * *')
  async handleCron() {
    this.logger.debug('Called when the current second is 10');
    const products = await this.getProductsByFilters(dataForRequestFlacon);
    await this.goldenAppleService.saveFetchProducts(products);
  }
  protected async getProductsByFilters(
    filters: TFilters,
  ): Promise<FetchProduct[]> {
    const products: FetchProduct[] = [];
    for (const body of filters) {
      const data = await this.fetchData(body);
      if (data.length) {
        products.push(
          ...data.map((product: unknown) => getFetchProduct(product)),
        );
      }
    }

    this.logger.debug('getProductsByFilters.length ' + products.length);
    this.logger.debug(products);

    return products;
  }
  protected async fetchData(baseBody: Record<string, any>): Promise<any[]> {
    let pageNumber = 1;
    const products: any[] = [];
    let haveItems: boolean = true;

    this.logger.debug(`fetchData, categoryId:${baseBody?.categoryId}`);

    while (haveItems && pageNumber < 100) {
      const { data } = await axios.post(productsUrl, {
        ...baseBody,
        pageNumber,
      });

      haveItems = Boolean(data.data.products.length);
      products.push(...data.data.products);

      pageNumber++;

      await sleep(500);
    }

    return products;
  }
}
