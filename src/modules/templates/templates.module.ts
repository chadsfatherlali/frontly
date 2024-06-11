import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from '../sites/sites.schema';
import { SitesService } from '../sites/sites.service';
import { User } from '../users/users.schema';
import { Page } from '../pages/page.schema';
import { UsersService } from '../users/users.service';
import { Template } from './templates.schema';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Site, User, Page, Template]),
  ],
  exports: [TypeOrmModule],
  controllers: [TemplatesController],
  providers: [ConsoleLogger, SitesService, TemplatesService, UsersService],
})
export class TemplatesModule {}
