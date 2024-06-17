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
import { EnvironmentVariables } from './interfaces/environment-variables.interface';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        secret: configService.get('JWT_SECRET', { infer: true }),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRE', { infer: true }),
        },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', { infer: true }),
        port: configService.get('DB_PORT', { infer: true }),
        username: configService.get('DB_USER', { infer: true }),
        password: configService.get('DB_PASSWORD', { infer: true }),
        database: configService.get('DB_NAME', { infer: true }),
        entities: ['dist/**/*.schema{.ts,.js}'],
        synchronize: configService.get('DB_SYNC', { infer: true }),
        logging: ['error'],
        cache: {
          duration: parseInt(
            configService.get('DB_CACHE', { infer: true }),
            10,
          ),
        },
        ssl: {
          rejectUnauthorized: configService.get('DB_REJECT_UNAUTHORIZE', {
            infer: true,
          }),
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
