import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Widget } from './widgets.schema';
import * as AdmZip from 'adm-zip';
import { CreateWidgetDto } from './widgets.dto';

@Injectable()
export class WidgetsService {
  constructor(@InjectModel(Widget.name) private widgetModel: Model<Widget>) {}

  async upload(
    createWidgetDto: CreateWidgetDto,
    file: Express.Multer.File,
  ): Promise<Widget> {
    try {
      const path: string = `./uploads/widgets/${createWidgetDto.tenantId}/${createWidgetDto.name}`;
      const zip: AdmZip = new AdmZip(file.buffer);

      zip.extractAllToAsync(path, true);

      createWidgetDto.path = path;

      const result = await this.widgetModel.create(createWidgetDto);

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async getWidgetsByTenanId(
    tenantId: mongoose.Schema.Types.ObjectId,
  ): Promise<Widget[]> {
    try {
      const result = this.widgetModel.find({ tenantId });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  partialHelper(
    root: string,
    indexJs: string,
    indexCss: string,
    tenantId: string,
    name: string,
  ): string {
    return `<div id="${root}"></div>
    <link rel="stylesheet" href="/widgets/${tenantId}/${name}/${indexCss}.css"  />
    <script type="module" src="/widgets/${tenantId}/${name}/${indexJs}.js"></script>`;
  }
}
