export class CreateWidgetDto {
  readonly siteId: string;
  path: string;
  readonly name: string;
  readonly root: string;
  readonly indexJs: string;
  readonly indexCss: string;
}

export class UpdateWidgetDto {
  readonly siteId: string;
  readonly root: string;
  readonly indexJs: string;
  readonly indexCss: string;
}
