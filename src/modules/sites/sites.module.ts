import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SitesController } from './sites.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Site } from './sites.schema';
import { SitesService } from './sites.service';
import { Page, PageSchema } from 'src/modules/pages/page.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.schema';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Site, User]),
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
  ],
  exports: [TypeOrmModule],
  controllers: [SitesController],
  providers: [ConsoleLogger, SitesService, UsersService],
})
export class SitesModule {}
