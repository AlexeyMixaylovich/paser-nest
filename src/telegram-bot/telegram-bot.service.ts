import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import * as TelegramBot from 'node-telegram-bot-api';
import { GoldenAppleService } from '@src/golden-apple/golden-apple.service';

@Injectable()
export class TelegramBotService implements OnModuleInit {
  protected bot: TelegramBot;
  private readonly logger = new Logger('TelegramBotService');

  constructor(
    private readonly configService: ConfigService,
    private readonly goldenAppleService: GoldenAppleService,
  ) {}

  onModuleInit() {
    this.initBot();
  }

  sendPhoto(photo: string, options: TelegramBot.SendPhotoOptions) {
    const chatId = this.configService.get<string>('bot.chatId');
    return this.bot.sendPhoto(chatId, photo, options);
  }
  protected initBot() {
    const token = this.configService.get<string>('bot.token');

    this.bot = new TelegramBot(token, { polling: true });
    this.bot.on('message', async (message: TelegramBot.Message) => {
      this.handleOnMessage(message);
    });
    this.bot.on('callback_query', async (query: TelegramBot.CallbackQuery) => {
      this.handleOnCallbackQuery(query);
    });
  }
  protected async handleOnMessage(message: TelegramBot.Message) {
    return message;
    // const { photo, options } = await this.goldenAppleService.getProduct();
    // this.bot.sendPhoto(message.chat.id, photo, options);
  }

  protected async handleOnCallbackQuery(query: TelegramBot.CallbackQuery) {
    const { data, message } = query;
    const [type, itemId] = data.split('_');

    if (type === 'info') {
      const description =
        await this.goldenAppleService.getDescriptionByItemId(itemId);
      this.bot.sendMessage(message.chat.id, description, {
        parse_mode: 'Markdown',
      });
      return;
    }
    if (type === 'photo') {
      const imageUrls =
        await this.goldenAppleService.getProductImageUrlsByItemId(itemId);
      imageUrls.forEach((img) => {
        this.bot.sendPhoto(message.chat.id, img);
      });
      return;
    }
    if (type === 'priceHistory') {
      const priceHistory =
        await this.goldenAppleService.getProductPriceHistoryByItemId(itemId);

      const text = priceHistory
        .map(
          ({ price, d }) =>
            `${moment(d).format('DD.MM.YYYY hh:mm')}     \`${price}₽\``,
        )
        .join('\n');
      this.bot.sendMessage(message.chat.id, text, { parse_mode: 'Markdown' });

      return;
    }
  }
}
