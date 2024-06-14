export class CreateSnippetDto {
  readonly name: string;
  readonly template: string;
  readonly siteId: string;
}

export class UpdateSnippetDto {
  readonly template: string;
  readonly siteId: string;
}
