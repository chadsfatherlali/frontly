import { HttpException, Inject, Injectable, Scope } from '@nestjs/common';
import { Widget } from './widgets.schema';
import * as AdmZip from 'adm-zip';
import { CreateWidgetDto } from './widgets.dto';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
    try {
      const path: string = `./uploads/widgets/${createWidgetDto.siteId}/${createWidgetDto.name}`;
      const zip: AdmZip = new AdmZip(file.buffer);

      zip.extractAllToAsync(path, true);

      createWidgetDto.path = path;

      const result = await this.widgetRepository.save(createWidgetDto);

      await this.dataSource
        .createQueryBuilder()
        .relation(User, 'widgets')
        .of(this.request.user.userId)
        .add(result.id);

      await this.dataSource
        .createQueryBuilder()
        .relation(Site, 'widgets')
        .of(result.siteId)
        .add(result.id);

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  /* async getWidgetsByTenanId(
    tenantId: mongoose.Schema.Types.ObjectId,
  ): Promise<Widget[]> {
    try {
      const result = this.widgetRepository.find({ tenantId });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  } */

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
