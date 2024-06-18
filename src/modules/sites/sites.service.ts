import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { Site } from './sites.schema';
import { CreateSiteDto } from './sites.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { User } from '../users/users.schema';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/interfaces/environment-variables.interface';

@Injectable({ scope: Scope.REQUEST })
export class SitesService {
  constructor(
    @Inject(REQUEST) private request: CustomRequest,
    @InjectRepository(Site) private siteRepository: Repository<Site>,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createSiteDto: CreateSiteDto): Promise<Site> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager
        .getRepository(Site)
        .save(createSiteDto);

      await queryRunner.manager
        .createQueryBuilder()
        .relation(User, 'sites')
        .of(this.request.user.userId)
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

  async findAll(): Promise<Site[]> {
    try {
      const result = await this.siteRepository.find();

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.status);
    }
  }

  async findBySlug(siteSlug: string): Promise<Site> {
    try {
      const result = await this.dataSource.getRepository(Site).findOne({
        where: { siteSlug },
        relations: ['user', 'pages', 'templates', 'snippets', 'widgets'],
        cache: parseInt(
          this.configService.get('DB_CACHE', { infer: true }),
          10,
        ),
      });

      if (!result) {
        throw new NotFoundException();
      }

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.status);
    }
  }
}
