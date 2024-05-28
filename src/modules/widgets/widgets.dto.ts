import mongoose from 'mongoose';

export class CreateWidgetDto {
  readonly tenantId: mongoose.Schema.Types.ObjectId;
  path: string;
  readonly name: string;
  readonly root: string;
  readonly indexJs: string;
  readonly indexCss: string;
}
