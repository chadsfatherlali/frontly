import { HttpException, Inject, Injectable, Scope } from '@nestjs/common';
import { Page } from './page.schema';
import { CreatePageDto } from './pages.dto';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/users.schema';
import { Site } from '../sites/sites.schema';

@Injectable({ scope: Scope.REQUEST })
export class PagesService {
  constructor(
    @Inject(REQUEST) private request: CustomRequest,
    @InjectRepository(Page) private pageRepository: Repository<Page>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createPageDto: CreatePageDto): Promise<Page> {
    try {
      const result = await this.pageRepository.save(createPageDto);

      await this.dataSource
        .createQueryBuilder()
        .relation(User, 'pages')
        .of(this.request.user.userId)
        .add(result.id);

      await this.dataSource
        .createQueryBuilder()
        .relation(Site, 'pages')
        .of(result.siteId)
        .add(result.id);

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async assignTemplate(pageId: string, templateId: string): Promise<Page> {
    try {
      const page = await this.pageRepository.findOne({ where: { id: pageId } });

      this.pageRepository.merge(page, { templateId });

      const result = this.pageRepository.save(page);

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async findAll(): Promise<Page[]> {
    try {
      const result = await this.pageRepository.find({
        where: { user: { id: this.request.user.userId } },
      });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async findOneById(id: string): Promise<Page> {
    try {
      const result = await this.pageRepository.findOne({
        where: { id },
        relations: ['template'],
      });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  /* async findPageByUrlAndTenantId(url: string, tenantId: string): Promise<Page> {
    try {
      const result = await this.pageModel
        .findOne({ url, tenantId })
        .populate('widgets');

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  } */

  /* async updatePage(body: UpdatePageDto): Promise<Page> {
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
  } */
}
