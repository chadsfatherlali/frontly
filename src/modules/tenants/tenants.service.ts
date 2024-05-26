import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from './tenant.schema';
import { CreateTenantDto } from './tenants.dto';
import { Page } from 'src/modules/pages/page.schema';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
    @InjectModel(Page.name) private pageModel: Model<Page>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    try {
      const result = await this.tenantModel.create(createTenantDto);

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async findAll(): Promise<Tenant[]> {
    try {
      const result = await this.tenantModel.find();

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async findBySlug(tenantSlug: string): Promise<Tenant> {
    try {
      const result = await this.tenantModel.findOne({ tenantSlug });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }
}
