import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantsController } from './tenants.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from 'src/schemas/tenant.schema';
import { TenantsService } from './tenants.service';
import { Page, PageSchema } from 'src/schemas/page.schema';

@Module({
  imports: [
    TenantsModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: Page.name, schema: PageSchema },
    ]),
  ],
  controllers: [TenantsController],
  providers: [ConsoleLogger, TenantsService],
})
export class TenantsModule {}
