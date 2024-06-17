export class CreatePageDto {
  readonly url: string;
  readonly siteId: string;
  readonly title: string;
}

export class AssignTemplateDto {
  readonly templateId: string;
}
