import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  dataForRequestFlacon,
  dataForRequestNabory,
} from '@src/golden-apple-parser/constants/filters';
import { GoldenAppleParserService } from '@src/golden-apple-parser/golden-apple-parser.service';
import { FetchProduct } from '@src/golden-apple-parser/types';
import { GoldenAppleService } from '@src/golden-apple/golden-apple.service';
import { getDataForSendPhoto } from '@src/golden-apple/helpers/mappers';
import { sleep } from '@src/helpers/sleep';

import { TelegramBotService } from '@src/telegram-bot/telegram-bot.service';
import type TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    protected readonly goldenAppleService: GoldenAppleService,
    protected readonly goldenAppleParserService: GoldenAppleParserService,
    protected readonly telegramBotService: TelegramBotService,
  ) {
    console.log(1);
  }

  @Cron('8 */1 * * * *')
  async parseFlacon() {
    const ctx = 'parseFlacon';
    this.logger.debug(ctx);
    const products =
      await this.goldenAppleParserService.getProductsByFilters(
        dataForRequestFlacon,
      );
    this.logger.debug(ctx + ' products.length ' + products.length);

    await this.saveAndSendData(products);
  }

  @Cron('30 */10 * * * *')
  async parseNabory() {
    const ctx = 'parseNabory';

    this.logger.debug(ctx);

    const products =
      await this.goldenAppleParserService.getProductsByFilters(
        dataForRequestNabory,
      );
    this.logger.debug(ctx + ' products.length ' + products.length);

    await this.saveAndSendData(products);
  }

  protected async saveAndSendData(products: FetchProduct[]) {
    const dataForSend: {
      photo: string;
      options: TelegramBot.SendPhotoOptions;
    }[] = [];

    for (const fetchProduct of products) {
      const { product, type } =
        await this.goldenAppleService.saveFetchProduct(fetchProduct);

      if (type !== 'notUpdated') {
        dataForSend.push(getDataForSendPhoto(type, product));
      }
    }

    let i = 0;
    for (const { photo, options } of dataForSend) {
      await this.telegramBotService.sendPhoto(photo, options);
      i++;
      await sleep(i < 10 ? 1000 : 5000);
    }
  }
}
