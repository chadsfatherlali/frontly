import { HttpException, Inject, Injectable, Scope } from '@nestjs/common';
import { Widget } from './widgets.schema';
import * as AdmZip from 'adm-zip';
import { CreateWidgetDto, UpdateWidgetDto } from './widgets.dto';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { User } from '../users/users.schema';
import { Site } from '../sites/sites.schema';
import { rimraf } from 'rimraf';

@Injectable({ scope: Scope.REQUEST })
export class WidgetsService {
  private readonly basePath: string = './uploads/widgets/';

  constructor(
    @Inject(REQUEST) private request: CustomRequest,
    @InjectRepository(Widget) private widgetRepository: Repository<Widget>,
    private readonly dataSource: DataSource,
  ) {}

  partialHelper(
    root: string,
    indexJs: string,
    indexCss: string,
    siteId: string,
    name: string,
  ): string {
    return `<div id="${siteId}_${name}">
      <div id="${root}"></div>
      <link rel="stylesheet" href="/widgets/${siteId}/${name}/assets/${indexCss}.css" />
      <script type="module" src="/widgets/${siteId}/${name}/assets/${indexJs}.js"></script>
    </div>`;
  }

  private uploadZippedFiles(
    siteId: string,
    name: string,
    file: Express.Multer.File,
  ): string {
    const path: string = `${this.basePath}${siteId}/${name}`;
    const zip: AdmZip = new AdmZip(file.buffer);

    zip.extractAllToAsync(path, true);

    return path;
  }

  async findAll(): Promise<Widget[]> {
    try {
      const result = this.widgetRepository.find({ relations: ['site'] });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.status);
    }
  }

  async createWidget(
    createWidgetDto: CreateWidgetDto,
    file: Express.Multer.File,
  ): Promise<Widget> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const path: string = this.uploadZippedFiles(
        createWidgetDto.siteId,
        createWidgetDto.name,
        file,
      );

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
      rimraf.sync(
        `${this.basePath}${createWidgetDto.siteId}/${createWidgetDto.name}`,
      );

      await queryRunner.rollbackTransaction();

      throw new HttpException(err?.message, err?.status);
    } finally {
      await queryRunner.release();
    }
  }

  async updateWidget(
    updateWidgetDto: UpdateWidgetDto,
    widgetId: string,
    file: Express.Multer.File,
  ): Promise<Widget> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const repository = queryRunner.manager.getRepository(Widget);
      const widget = await this.widgetRepository.findOne({
        where: { id: widgetId },
        relations: ['site'],
      });

      rimraf.sync(`${this.basePath}${widget.site.id}/${widget.name}`);

      const path: string = this.uploadZippedFiles(
        widget.site.id,
        widget.name,
        file,
      );

      repository.merge(widget, updateWidgetDto);

      const result = await repository.save(widget);

      await queryRunner.commitTransaction();

      return result;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(err?.message, err?.status);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteWidget(widgetId: string) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const widget = await this.widgetRepository.findOne({
        where: { id: widgetId },
        relations: ['site'],
      });

      rimraf.sync(`${this.basePath}${widget.site.id}/${widget.name}`);

      const result = await queryRunner.manager
        .getRepository(Widget)
        .delete({ id: widgetId });

      await queryRunner.commitTransaction();

      return result;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(err?.message, err?.status);
    } finally {
      await queryRunner.release();
    }
  }
}
