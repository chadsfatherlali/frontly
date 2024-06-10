import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SnippetDocument = HydratedDocument<Snippet>;

@Schema({ timestamps: true })
export class Snippet {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  tenantId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  template: string;
}

export const SnippetSchema = SchemaFactory.createForClass(Snippet);

SnippetSchema.index({ tenantId: 1, name: 1 }, { unique: true });
