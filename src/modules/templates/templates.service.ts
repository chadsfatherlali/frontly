import { HttpException, Inject, Injectable, Scope } from '@nestjs/common';
import { Template } from './templates.schema';
import { CreateTemplateDto } from './templates.dto';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
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
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager
        .getRepository(Template)
        .save(createTemplateDto);

      await queryRunner.manager
        .createQueryBuilder()
        .relation(User, 'templates')
        .of(this.request.user.userId)
        .add(result.id);

      await queryRunner.manager
        .createQueryBuilder()
        .relation(Site, 'templates')
        .of(result.siteId)
        .add(result.id);

      await queryRunner.commitTransaction();

      return result;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(err?.message, err?.status);
    } finally {
      await queryRunner.release();
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
