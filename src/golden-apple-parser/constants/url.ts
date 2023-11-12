export const domain = 'https://goldapple.ru';

export const productsUrl = new URL('/front/api/catalog/products', domain).href;
export const productUrl = new URL('/front/api/catalog/product-card', domain)
  .href;
