import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWidgetDto } from './widgets.dto';
import { Widget } from './widgets.schema';

@Injectable()
export class WidgetsService {
  constructor(@InjectModel(Widget.name) private widgetModel: Model<Widget>) {}

  async create(createWidgetDto: CreateWidgetDto): Promise<Widget> {
    try {
      const result = await this.widgetModel.create(createWidgetDto);

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }
}
