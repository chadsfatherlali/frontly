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
      throw new HttpException(err?.message, err?.status);
    }
  }

  async assignTemplate(pageId: string, templateId: string): Promise<Page> {
    try {
      const page = await this.pageRepository.findOne({ where: { id: pageId } });

      this.pageRepository.merge(page, { templateId });

      const result = this.pageRepository.save(page);

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.status);
    }
  }

  async findAll(): Promise<Page[]> {
    try {
      const result = await this.pageRepository.find({
        where: { user: { id: this.request.user.userId } },
      });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.status);
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
      throw new HttpException(err?.message, err?.status);
    }
  }
}
