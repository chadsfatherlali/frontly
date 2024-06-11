import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SitesController } from './sites.controller';
import { Site } from './sites.schema';
import { SitesService } from './sites.service';
import { Page } from 'src/modules/pages/page.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.schema';
import { Template } from '../templates/templates.schema';
import { TemplatesService } from '../templates/templates.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Site, User, Page, Template]),
  ],
  exports: [TypeOrmModule],
  controllers: [SitesController],
  providers: [ConsoleLogger, SitesService, UsersService, TemplatesService],
})
export class SitesModule {}
