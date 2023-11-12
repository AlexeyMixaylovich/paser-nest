import { escapeMarkdown } from '@src/helpers/escape-md';
import type { GoldenAppleProduct } from '@src/schemas/golden-apple.schema';
import type TelegramBot from 'node-telegram-bot-api';

const getPrice = ({ regular, actual }: GoldenAppleProduct['price']) => {
  const p = `\`${actual}₽\``;
  if (regular === actual) {
    return p;
  }
  return `${p} ***~~~${regular}~~~***`;
};

export const getDataForSendPhoto = (
  type: 'new' | 'updated',
  product: GoldenAppleProduct,
): { photo: string; options: TelegramBot.SendPhotoOptions } => {
  return {
    photo: product.imageUrls[0],
    options: {
      caption: [
        type === 'new'
          ? '***НОВИНОЧКА***'
          : `***ЦЕНА ИЗМЕНИЛАСЬ*** ~~~${product.priceHistory[
              product.priceHistory.length - 2
            ]?.price}~~~`,
        escapeMarkdown(`${product.brand} ${product.name}`),
        `***${escapeMarkdown(product.productType)}***`,
        `${getPrice(product.price)}   [купить](${product.url})`,
      ].join('\n'),
      parse_mode: 'MarkdownV2',
      disable_notification: false,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Описание ℹ️',
              callback_data: 'info' + '_' + product.itemId,
            },
            {
              text: 'История цен',
              callback_data: 'priceHistory' + '_' + product.itemId,
            },
            {
              text: 'Фото 🖼',
              callback_data: 'photo' + '_' + product.itemId,
            },
          ],
        ],
      },
    },
  };
};
