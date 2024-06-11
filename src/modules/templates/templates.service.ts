import { HttpException, Inject, Injectable, Scope } from '@nestjs/common';
import { Template } from './templates.schema';
import { CreateTemplateDto } from './templates.dto';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/users.schema';
import { Site } from '../sites/sites.schema';

@Injectable({ scope: Scope.REQUEST })
export class TemplatesService {
  constructor(
    @Inject(REQUEST) private request: CustomRequest,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    try {
      const result = await this.templateRepository.save(createTemplateDto);

      await this.dataSource
        .createQueryBuilder()
        .relation(User, 'templates')
        .of(this.request.user.userId)
        .add(result.id);

      await this.dataSource
        .createQueryBuilder()
        .relation(Site, 'templates')
        .of(result.siteId)
        .add(result.id);

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  /* async findAll(): Promise<Page[]> {
    try {
      const result = await this.pageRepository.find({
        where: { userId: this.request.user.userId },
      });

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
