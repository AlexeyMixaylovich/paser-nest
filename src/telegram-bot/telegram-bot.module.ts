import { Module } from '@nestjs/common';
import { GoldenAppleModule } from '@src/golden-apple/golden-apple.module';
import { TelegramBotService } from './telegram-bot.service';

@Module({
  imports: [GoldenAppleModule],
  exports: [TelegramBotService],
  providers: [TelegramBotService],
})
export class TelegramBotModule {}
