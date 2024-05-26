import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Page } from './page.schema';
import { CreatePageDto } from './pages.dto';

@Injectable()
export class PagesService {
  constructor(@InjectModel(Page.name) private pageModel: Model<Page>) {}

  async create(createPageDto: CreatePageDto): Promise<Page> {
    try {
      const result = await this.pageModel.create(createPageDto);

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async findPagesByTenant(
    tenantId: mongoose.Schema.Types.ObjectId,
  ): Promise<Page[]> {
    try {
      const result = await this.pageModel.find({ tenantId });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async findPageByUrlAndTenantId(
    url: string,
    tenantId: mongoose.Schema.Types.ObjectId,
  ): Promise<Page> {
    try {
      const result = await this.pageModel.findOne({ url, tenantId });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }
}
