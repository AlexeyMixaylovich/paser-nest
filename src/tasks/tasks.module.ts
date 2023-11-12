import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { GoldenAppleModule } from '@src/golden-apple/golden-apple.module';
import { GoldenAppleParserModule } from '@src/golden-apple-parser/golden-apple-parser.module';
import { TelegramBotModule } from '@src/telegram-bot/telegram-bot.module';

@Module({
  providers: [TasksService],
  imports: [GoldenAppleModule, GoldenAppleParserModule, TelegramBotModule],
})
export class TasksModule {}
