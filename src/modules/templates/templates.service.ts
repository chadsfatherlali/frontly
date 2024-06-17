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
      throw new HttpException(err?.message, err?.status);
    }
  }

  async findAll(): Promise<Template[]> {
    try {
      const result = await this.templateRepository.find({
        where: { user: { id: this.request.user.userId } },
      });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.status);
    }
  }
}
