import { get } from 'lodash';

import { escapeMarkdown } from '@src/helpers/escape-md';

import { domain } from '../constants/url';
import { FetchProduct } from '../types';

export const clearText = (t: string) => escapeMarkdown(t);

const getImgUrl = (img: string) =>
  img.replace('${screen}', 'mobile').replace('${format}', 'jpg');

export const getFetchProduct = (p: any): FetchProduct => ({
  itemId: get(p, 'itemId'),
  name: get(p, 'name'),
  productType: get(p, 'productType'),
  type: get(p, 'type'),
  brand: get(p, 'brand'),
  price: {
    regular: get(p, 'price.regular.amount'),
    actual: get(p, 'price.actual.amount'),
  },
  imageUrls: (get(p, 'imageUrls') || []).map((img: any) =>
    getImgUrl(img?.url || ''),
  ),
  url: new URL(get(p, 'url'), domain).href,
});
