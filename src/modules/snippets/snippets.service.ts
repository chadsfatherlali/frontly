import { HttpException, Inject, Injectable, Scope } from '@nestjs/common';
import { CreateSnippetDto } from './snippets.dto';
import { Snippet } from './snippet.schema';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { User } from '../users/users.schema';
import { Site } from '../sites/sites.schema';

@Injectable({ scope: Scope.REQUEST })
export class SnippetsService {
  constructor(
    @Inject(REQUEST) private request: CustomRequest,
    @InjectRepository(Snippet) private snippetRepository: Repository<Snippet>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createSnippetDto: CreateSnippetDto): Promise<Snippet> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager
        .getRepository(Snippet)
        .save(createSnippetDto);

      await queryRunner.manager
        .createQueryBuilder()
        .relation(User, 'snippets')
        .of(this.request.user.userId)
        .add(result.id);

      await queryRunner.manager
        .createQueryBuilder()
        .relation(Site, 'snippets')
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

  async findAll(): Promise<Snippet[]> {
    try {
      const result = await this.snippetRepository.find({
        where: { user: { id: this.request.user.userId } },
      });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.status);
    }
  }

  async updateSnippet(
    snippetId: string,
    siteId: string,
    template: string,
  ): Promise<Snippet> {
    try {
      const snippet = await this.snippetRepository.findOne({
        where: { id: snippetId, site: { id: siteId } },
      });

      this.snippetRepository.merge(snippet, { template });

      const result = this.snippetRepository.save(snippet);

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.status);
    }
  }
}
