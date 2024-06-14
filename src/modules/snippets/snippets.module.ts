import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SnippetsController } from './snippets.controller';
import { SnippetsService } from './snippets.service';
import { Snippet } from './snippet.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from '../sites/sites.schema';
import { User } from '../users/users.schema';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Site, User, Snippet])],
  controllers: [SnippetsController],
  providers: [ConsoleLogger, SnippetsService],
})
export class SnippetsModule {}
