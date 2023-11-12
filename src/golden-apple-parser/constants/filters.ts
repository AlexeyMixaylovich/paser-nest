const cityId = '0c5b2444-70a0-4932-980c-b4dc0d3f02b5';
const cityDistrict = 'Северное Бутово';
const customerGroupId = '7';

const baseFilters = {
  StoreStocks: {
    value: true,
    id: '63568bc7bf461b4b2bde3b23',
    type: 'checkType',
    name: 'StoreStocks',
    key: 'storestocks',
  },
  CustomerDiscounts: {
    value: true,
    id: '6475a9c1cc1d8de257434afa',
    type: 'checkType',
    name: 'CustomerDiscounts',
    key: 'customerdiscounts',
  },
};
const getBaseData = (categoryId: number, filters: any[]) => ({
  categoryId,
  cityId,
  cityDistrict,
  // pageNumber: 10,
  filters,
  customerGroupId,
});

export type TFilters = ReturnType<typeof getBaseData>[];

export const dataForRequestNabory = [
  getBaseData(
    1000000037, // /uhod/nabory
    [baseFilters.StoreStocks],
  ),
  getBaseData(
    1000000888, // /volosy/nabory
    [baseFilters.StoreStocks],
  ),
  getBaseData(
    1000000026, // /makijazh/nabory
    [baseFilters.StoreStocks],
  ),
];

export const dataForRequestFlacon = [
  getBaseData(
    1000001798, // /brands/flacon-magazine
    [baseFilters.StoreStocks],
  ),
];
