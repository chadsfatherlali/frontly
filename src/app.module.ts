import { ConsoleLogger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PagesModule } from './modules/pages/pages.module';
import { SitesModule } from './modules/sites/sites.module';
import { SitesService } from './modules/sites/sites.service';
import { PagesService } from './modules/pages/pages.service';
import { SnippetsModule } from './modules/snippets/snippets.module';
import { SnippetsService } from './modules/snippets/snippets.service';
import { WidgetsModule } from './modules/widgets/widgets.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WidgetsService } from './modules/widgets/widgets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { UsersService } from './modules/users/users.service';
import { AuthService } from './modules/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { LocalStrategy } from './modules/auth/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TemplatesModule } from './modules/templates/templates.module';
import { TemplatesService } from './modules/templates/templates.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', ''),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRE', ''),
        },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USER', ''),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', ''),
        entities: ['dist/**/*.schema{.ts,.js}'],
        synchronize: configService.get<boolean>('DB_SYNC', false),
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    PassportModule,
    AuthModule,
    TemplatesModule,
    UsersModule,
    WidgetsModule,
    SnippetsModule,
    PagesModule,
    SitesModule,
  ],
  controllers: [AppController],
  providers: [
    JwtService,
    AppService,
    ConsoleLogger,
    ConfigService,
    TemplatesService,
    SitesService,
    PagesService,
    SnippetsService,
    WidgetsService,
    UsersService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AppModule {}
