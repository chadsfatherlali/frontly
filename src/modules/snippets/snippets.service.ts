import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateSnippetDto } from './snippets.dto';
import { Snippet } from './snippet.schema';

@Injectable()
export class SnippetsService {
  constructor(
    @InjectModel(Snippet.name) private snippetModel: Model<Snippet>,
  ) {}

  async create(createSnippetDto: CreateSnippetDto): Promise<Snippet> {
    try {
      const result = await this.snippetModel.create(createSnippetDto);

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async findSnippetsByTenant(
    tenantId: mongoose.Schema.Types.ObjectId,
  ): Promise<Snippet[]> {
    try {
      const result = await this.snippetModel.find({ tenantId });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }
}
