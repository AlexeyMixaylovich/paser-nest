import { Injectable, Logger } from '@nestjs/common';
import { sleep } from '@src/helpers/sleep';
import axios from 'axios';
import { productUrl, productsUrl } from './constants/url';
import { TFilters, cityId, customerGroupId } from './constants/filters';
import { FetchProduct } from './types';
import { getFetchProduct } from './helpers/mappers';

@Injectable()
export class GoldenAppleParserService {
  private readonly logger = new Logger(GoldenAppleParserService.name);

  async getProductsByFilters(filters: TFilters): Promise<FetchProduct[]> {
    const products: FetchProduct[] = [];
    for (const body of filters) {
      const data = await this.fetchData(body);
      if (data.length) {
        products.push(
          ...data.map((product: unknown) => getFetchProduct(product)),
        );
      }
    }

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
  async fetchDescriptionByItemId(itemId: string): Promise<string> {
    const { data } = await axios.get(productUrl, {
      params: { itemId, cityId, customerGroupId },
    });

    const description = (data.data?.productDescription || []).find(
      (d: any) => d?.type === 'Description',
    );
    return (description?.content || '').replaceAll('<br>', '');
  }
}
