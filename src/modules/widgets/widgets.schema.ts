import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type WidgetsDocument = HydratedDocument<Widget>;

@Schema({ timestamps: true })
export class Widget {
  @Prop({ required: true })
  tenantId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  template: string;
}

export const WidgetSchema = SchemaFactory.createForClass(Widget);

WidgetSchema.index({ tenantId: 1, name: 1 }, { unique: true });
