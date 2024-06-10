import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UsersController } from '../users/users.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
  controllers: [UsersController, AuthController],
  providers: [ConsoleLogger, UsersService, AuthService, JwtService],
})
export class AuthModule {}
