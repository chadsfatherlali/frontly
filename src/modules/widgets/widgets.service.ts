import { HttpException, Inject, Injectable, Scope } from '@nestjs/common';
import { Widget } from './widgets.schema';
import * as AdmZip from 'adm-zip';
import { CreateWidgetDto } from './widgets.dto';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { User } from '../users/users.schema';
import { Site } from '../sites/sites.schema';

@Injectable({ scope: Scope.REQUEST })
export class WidgetsService {
  constructor(
    @Inject(REQUEST) private request: CustomRequest,
    @InjectRepository(Widget) private widgetRepository: Repository<Widget>,
    private readonly dataSource: DataSource,
  ) {}

  async upload(
    createWidgetDto: CreateWidgetDto,
    file: Express.Multer.File,
  ): Promise<Widget> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const path: string = `./uploads/widgets/${createWidgetDto.siteId}/${createWidgetDto.name}`;
      const zip: AdmZip = new AdmZip(file.buffer);

      zip.extractAllToAsync(path, true);

      createWidgetDto.path = path;

      const result = await queryRunner.manager
        .getRepository(Widget)
        .save(createWidgetDto);

      await queryRunner.manager
        .createQueryBuilder()
        .relation(User, 'widgets')
        .of(this.request.user.userId)
        .add(result.id);

      await queryRunner.manager
        .createQueryBuilder()
        .relation(Site, 'widgets')
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

  partialHelper(
    root: string,
    indexJs: string,
    indexCss: string,
    siteId: string,
    name: string,
  ): string {
    return `<div id="${root}"></div>
    <link rel="stylesheet" href="/widgets/${siteId}/${name}/assets/${indexCss}.css"  />
    <script type="module" src="/widgets/${siteId}/${name}/assets/${indexJs}.js"></script>`;
  }
}
