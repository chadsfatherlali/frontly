import { HttpException, Inject, Injectable, Scope } from '@nestjs/common';
import { Site } from './sites.schema';
import { CreateSiteDto } from './sites.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { User } from '../users/users.schema';

@Injectable({ scope: Scope.REQUEST })
export class SitesService {
  constructor(
    @Inject(REQUEST) private request: CustomRequest,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Site) private siteRepository: Repository<Site>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createSiteDto: CreateSiteDto): Promise<Site> {
    try {
      const result = await this.siteRepository.save(createSiteDto);

      await this.dataSource
        .createQueryBuilder()
        .relation(User, 'sites')
        .of(this.request.user.userId)
        .add(result.id);

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async findAll(): Promise<Site[]> {
    try {
      const result = await this.siteRepository.find();

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async findBySlug(siteSlug: string): Promise<Site> {
    try {
      const result = await this.siteRepository.findOne({
        where: { siteSlug },
        relations: ['user', 'pages', 'templates'],
      });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }
}
