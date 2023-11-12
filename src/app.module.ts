import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from '@config';

import { TelegramBotModule } from './telegram-bot/telegram-bot.module';

@Module({
  imports: [
    TelegramBotModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [],
})
export class AppModule {}
