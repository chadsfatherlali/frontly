import { HttpException, Inject, Injectable, Scope } from '@nestjs/common';
import { CreateSnippetDto } from './snippets.dto';
import { Snippet } from './snippet.schema';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
    try {
      const result = await this.snippetRepository.save(createSnippetDto);

      await this.dataSource
        .createQueryBuilder()
        .relation(User, 'snippets')
        .of(this.request.user.userId)
        .add(result.id);

      await this.dataSource
        .createQueryBuilder()
        .relation(Site, 'snippets')
        .of(result.siteId)
        .add(result.id);

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async findAll(): Promise<Snippet[]> {
    try {
      const result = await this.snippetRepository.find({
        where: { user: { id: this.request.user.userId } },
      });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
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
      throw new HttpException(err?.message, err?.statusCode);
    }
  }
}
