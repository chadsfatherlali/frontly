import mongoose from 'mongoose';

export class CreatePageDto {
  readonly tenantId: string;
  readonly url: string;
  readonly template: string;
}

export class UpdatePageDto {
  readonly _id: mongoose.Schema.Types.ObjectId;
  readonly tenantId: string;
  readonly url: string;
  readonly template: string;
  widgets: mongoose.Schema.Types.ObjectId[];
  snippets: mongoose.Schema.Types.ObjectId[];
}
