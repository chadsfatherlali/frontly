import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type WidgetsDocument = HydratedDocument<Widget>;

@Schema({ timestamps: true })
export class Widget {
  @Prop({ required: true })
  tenantId: mongoose.Schema.Types.ObjectId;

  @Prop()
  path: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  root: string;

  @Prop({ required: true })
  indexJs: string;

  @Prop({ required: true })
  indexCss: string;
}

export const WidgetSchema = SchemaFactory.createForClass(Widget);
