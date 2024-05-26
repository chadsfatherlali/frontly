import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SnippetsController } from './snippets.controller';
import { SnippetsService } from './snippets.service';
import { Snippet, SnippetSchema } from './snippet.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Snippet.name, schema: SnippetSchema }]),
  ],
  controllers: [SnippetsController],
  providers: [ConsoleLogger, SnippetsService],
})
export class SnippetsModule {}
