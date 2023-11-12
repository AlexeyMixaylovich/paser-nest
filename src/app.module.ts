import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from '@config';

import { TelegramBotModule } from './telegram-bot/telegram-bot.module';
import { GoldenAppleModule } from './golden-apple/golden-apple.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { GoldenAppleParserService } from './golden-apple-parser/golden-apple-parser.service';
import { GoldenAppleParserModule } from './golden-apple-parser/golden-apple-parser.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.connectionString'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    TelegramBotModule,
    GoldenAppleModule,
    GoldenAppleParserModule,
  ],
  controllers: [],
  providers: [GoldenAppleParserService],
})
export class AppModule {}
