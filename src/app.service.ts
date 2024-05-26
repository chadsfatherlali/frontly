import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import Handlebars from 'handlebars';
import { TenantsService } from './modules/tenants/tenants.service';
import { PagesService } from './modules/pages/pages.service';
import { SnippetsService } from './modules/snippets/snippets.service';
import { Snippet } from './modules/snippets/snippet.schema';

@Injectable()
export class AppService {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly pagesServices: PagesService,
    private readonly snippetsServices: SnippetsService,
    private readonly consoleLogger: ConsoleLogger,
  ) {}

  async getPage(tenantSlug: string, url: string): Promise<string> {
    const tenantData = await this.tenantsService.findBySlug(tenantSlug);
    const pageData = await this.pagesServices.findPageByUrlAndTenantId(
      `/${url}`,
      tenantData._id,
    );

    this.consoleLogger.log(
      `======================== ${tenantSlug}/${url} ========================`,
    );
    this.consoleLogger.log(tenantData);
    this.consoleLogger.log(pageData);

    if (!tenantData || !pageData) {
      throw new NotFoundException();
    }

    if (tenantData._id.toString() !== pageData.tenantId.toString()) {
      throw new NotFoundException();
    }

    const snippetsData = await this.snippetsServices.findSnippetsByTenant(
      tenantData._id,
    );

    const templateCode: string = pageData.template;
    const template: any = Handlebars.compile(templateCode);

    if (snippetsData.length) {
      snippetsData.forEach((snippet: Snippet) => {
        Handlebars.registerPartial(snippet.name, snippet.template);
      });
    }

    const result: any = template();

    return result;
  }
}
