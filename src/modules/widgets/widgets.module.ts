import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WidgetsController } from './widgets.controller';
import { WidgetsService } from './widgets.service';
import { Widget } from './widgets.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.schema';
import { Site } from '../sites/sites.schema';
import { UsersService } from '../users/users.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Widget, User, Site])],
  controllers: [WidgetsController],
  exports: [TypeOrmModule],
  providers: [ConsoleLogger, WidgetsService, UsersService],
})
export class WidgetsModule {}
