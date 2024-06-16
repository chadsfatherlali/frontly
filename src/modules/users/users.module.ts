import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { User } from './users.schema';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from '../templates/templates.schema';
import { TemplatesService } from '../templates/templates.service';
import { Snippet } from '../snippets/snippet.schema';
import { SnippetsService } from '../snippets/snippets.service';
import { Widget } from '../widgets/widgets.schema';
import { WidgetsService } from '../widgets/widgets.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Template, Snippet, Widget]),
  ],
  exports: [TypeOrmModule],
  controllers: [UsersController],
  providers: [
    ConsoleLogger,
    UsersService,
    TemplatesService,
    SnippetsService,
    WidgetsService,
  ],
})
export class UsersModule {}
