import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from '../sites/sites.schema';
import { Page } from './page.schema';
import { SitesService } from '../sites/sites.service';
import { User } from '../users/users.schema';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Page, Site, User])],
  exports: [TypeOrmModule],
  controllers: [PagesController],
  providers: [ConsoleLogger, PagesService, SitesService],
})
export class PagesModule {}
