import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';

const testProduct = {
  price: {
    regular: 4470,
    discount: 2235,
    old: 4470,
    actual: 2235,
  },
  itemId: '19000169265',
  mainVariantItemId: '19000169265',
  name: 'Heartleaf calming 2 Step set',
  productType: 'Набор для ухода за кожей лица',
  type: 'Product',
  brand: 'ABIB',
  imageUrls: [
    'https://pcdn.goldapple.ru/p/p/19000169265/web/696d674d61696e8db8c1b35d4ee13mobile.jpg',
    'https://pcdn.goldapple.ru/p/p/19000169265/web/696d67416464318db8c1b38d2d052mobile.jpg',
    'https://pcdn.goldapple.ru/p/p/19000169265/web/696d67416464328db8c1b3bb8872emobile.jpg',
    'https://pcdn.goldapple.ru/p/p/19000169265/web/696d67416464338db8c1b3ef05a4dmobile.jpg',
  ],

  url: 'https://goldapple.ru/19000169265-heartleaf-calming-2-step-set',
  configurable: false,
  needOnlineConsultation: false,
  reviews: {
    rating: 5,
    reviewsCount: 1,
  },
};
const content =
  'Не особо хочется жить скромно, когда существуют Clé de Peau Beauté, PAYOT, Guinot, URIAGE. Кстати именно их (и другие бриллианты) Flacon Magazine сложил в косметичку F X EGOISTKA. Тестите люксовые банки и даже не думайте понижать бьюти-планку! <br><br>\n\nКосметичка с алюминиевым фермуаром выполнена из полиэстера и синтепона.<br> \nРазмеры: 21 см х 28 см х 11 см.<br><br>\n\nЧто внутри?<br>\n1. PAYOT, универсальный крем для лица с эфирным маслом лаванды, миниатюра, 15 мл. <br><br>\n\n2. Clé de Peau Beauté, жидкая помада с эффектом матового покрытия, 102/104/106, полноразмерная, 8 мл.<br>\nПопадается один из оттенков: 102, 104, 106.<br><br>\n\n3. HFC, парфюмерная вода Voodoo Chic, миниатюра, 7,5 мл. <br>\n4. Guinot, гель против воспалений с комплексом AcniClear, миниатюра, 3 мл.<br>\n5. Clarins, блеск для губ Natural Lip Perfector, оттенок 01 rose shimmer, миниатюра, 5 мл.<br>\n6. BELIF, увлажняющий крем-гель для нормальной и жирной кожи, миниатюра, 10 мл. <br>\n7. Latte Beauty, тушь для ресниц с эффектом объема, black, полноразмерная, 12 мл. <br>\n8. ESSENTIAL PARFUMS PARIS, парфюмерная вода FIG INFUSION by Nathalie Lorson, семпл, 2 мл. <br>\n9. Make Up For Ever, тональное средство HD SKIN MATTE VELVET, 1N06, миниатюра, 2 г.<br>\n10. Zeitun, питательный крем для тела с карите и сладким миндалем, полноразмерный, 200 мл. <br>\n11. SA.AL&CO, увлажняющий крем для лица с гиалуроновой кислотой, миниатюра, 2 мл. <br><br>\n\n12. Попадается один из продуктов бренда ALFAPARF Milano Professional:<br>\n- Alfaparf Milano Professional, маска для сухих волос Semi Di Lino Moisture Nutritive Mask, тревел-формат, 50 мл.<br> \n- Alfaparf Milano Professional, маска для поврежденных волос Semi Di Lino Reconstruction Reparative Mask, тревел-формат, 50 мл.<br><br> \n\n13. URIAGE, ночная увлажняющая маска, миниатюра, 15 мл. <br>\n14. Laboratorium, сыворотка с витамином С, полноразмерная, 50 мл. <br>\n15. INSTITUT KARITE PARIS, масло ши 100%, полноразмерное, 10 мл. <br>\n16. Premium Jigott & La Miso, крем для ног с муцином улитки, полноразмерный, 100 мл. <br>\n17. Cosworker, тканевая маска для интенсивного увлажнения кожи, полноразмерная, 1 шт.<br>\n18. MegRhythm, паровая маска для глаз «Лаванда — шалфей», полноразмерная, 1 шт. <br>\n19. MISSHA, тональный BB-крем «Идеальное покрытие» SPF42/PA+++ М Perfect Cover BB Cream, тон 23, саше, 1 мл.<br><br>\n\nОбращаем ваше внимание, бесплатная доставка не распространяется на товары Flacon Magazine.'.replaceAll(
    '<br>',
    '',
  );

const baseMessageArgs: [string, TelegramBot.SendPhotoOptions] = [
  testProduct.imageUrls[0],
  {
    caption: [
      testProduct.name,
      testProduct.productType,
      testProduct.price.regular,
    ].join('\n'),
    parse_mode: 'MarkdownV2',
    disable_notification: false,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Описание ℹ️',
            callback_data: 'info' + '_' + testProduct.itemId,
          },
          {
            text: 'История цен',
            callback_data: 'priceHistory' + '_' + testProduct.itemId,
          },
          {
            text: 'Фото 🖼',
            callback_data: 'photo' + '_' + testProduct.itemId,
          },
        ],
      ],
    },
  },
];
@Injectable()
export class TelegramBotService implements OnModuleInit {
  protected bot: TelegramBot;
  private readonly logger = new Logger('TelegramBotService');

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initBot();
  }
  initBot() {
    const token = this.configService.get<string>('bot.token');

    this.bot = new TelegramBot(token, { polling: true });
    this.bot.on(
      'message',
      (message: TelegramBot.Message, metadata: TelegramBot.Metadata) => {
        this.logger.log(message);
        this.logger.log(metadata);

        this.bot.sendPhoto(message.chat.id, ...baseMessageArgs);
      },
    );
    this.bot.on(
      'callback_query',
      ({ data, message }: TelegramBot.CallbackQuery) => {
        const [type, id] = data.split('_');
        this.logger.log({ type, id });
        this.logger.log(message);

        if (type === 'info') {
          this.bot.sendMessage(message.chat.id, content, {
            parse_mode: 'Markdown',
          });
          return;
        }
        if (type === 'photo') {
          testProduct.imageUrls.forEach((img) => {
            this.bot.sendPhoto(message.chat.id, img);
          });
        }
      },
    );
  }
}
