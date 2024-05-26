import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PageDocument = HydratedDocument<Page>;

@Schema({ timestamps: true })
export class Page {
  @Prop({ required: true })
  tenantId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  template: string;
}

export const PageSchema = SchemaFactory.createForClass(Page);

PageSchema.index({ tenantId: 1, url: 1 }, { unique: true });
