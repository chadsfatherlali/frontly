import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Page } from '../pages/page.schema';

export type TenantDocument = HydratedDocument<Tenant>;

@Schema({ timestamps: true, autoIndex: true })
export class Tenant {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  tenantSlug: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Page' })
  page: Page;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
