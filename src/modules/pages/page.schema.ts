import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Widget } from '../widgets/widgets.schema';
import { Snippet } from '../snippets/snippet.schema';

export type PageDocument = HydratedDocument<Page>;

@Schema({ timestamps: true })
export class Page {
  @Prop({ required: true })
  tenantId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  template: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Widget', unique: true }])
  widgets: Widget[];

  @Prop([
    { type: mongoose.Schema.Types.ObjectId, ref: 'Snippet', unique: true },
  ])
  snippets: Snippet[];
}

export const PageSchema = SchemaFactory.createForClass(Page);

PageSchema.index({ tenantId: 1, url: 1 }, { unique: true });
