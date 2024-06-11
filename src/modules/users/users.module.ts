import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { User } from './users.schema';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from '../templates/templates.schema';
import { TemplatesService } from '../templates/templates.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User, Template])],
  exports: [TypeOrmModule],
  controllers: [UsersController],
  providers: [ConsoleLogger, UsersService, TemplatesService],
})
export class UsersModule {}
