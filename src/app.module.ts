import { ConsoleLogger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PagesModule } from './modules/pages/pages.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { TenantsService } from './modules/tenants/tenants.service';
import { PagesService } from './modules/pages/pages.service';
import { Page, PageSchema } from './modules/pages/page.schema';
import { Tenant, TenantSchema } from './modules/tenants/tenant.schema';
import { SnippetsModule } from './modules/snippets/snippets.module';
import { Snippet, SnippetSchema } from './modules/snippets/snippet.schema';
import { SnippetsService } from './modules/snippets/snippets.service';
import { WidgetsModule } from './modules/widgets/widgets.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL', ''),
        dbName: configService.get<string>('DB_NAME', ''),
        autoIndex: true,
        autoCreate: true,
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    WidgetsModule,
    SnippetsModule,
    PagesModule,
    TenantsModule,
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: Page.name, schema: PageSchema },
      { name: Snippet.name, schema: SnippetSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConsoleLogger,
    ConfigService,
    TenantsService,
    PagesService,
    SnippetsService,
  ],
})
export class AppModule {}
