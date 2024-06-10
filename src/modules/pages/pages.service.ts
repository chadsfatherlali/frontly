import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Page } from './page.schema';
import { CreatePageDto, UpdatePageDto } from './pages.dto';
import { Snippet } from '../snippets/snippet.schema';
import { Widget } from '../widgets/widgets.schema';

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
      const result = await this.pageModel
        .find({ tenantId })
        .populate('widgets');

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async findPageByUrlAndTenantId(url: string, tenantId: string): Promise<Page> {
    try {
      const result = await this.pageModel
        .findOne({ url, tenantId })
        .populate('widgets');

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async updatePage(body: UpdatePageDto): Promise<Page> {
    try {
      const { _id, tenantId } = body;

      const page = await this.pageModel.findOne({ _id, tenantId });

      page.snippets.forEach((snippet: Snippet) =>
        body.snippets.push(snippet._id),
      );

      page.widgets.forEach((widget: Widget) => body.widgets.push(widget._id));

      const result = await this.pageModel.findByIdAndUpdate(
        {
          _id,
          tenantId,
        },
        body,
      );

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }
}
