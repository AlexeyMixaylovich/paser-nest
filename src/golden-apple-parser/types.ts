import type { GoldenAppleProduct } from '@src/schemas/golden-apple.schema';

export type FetchProduct = Omit<
  GoldenAppleProduct,
  '_id' | 'createdAt' | 'updatedAt'
>;
