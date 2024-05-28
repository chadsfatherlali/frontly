import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import Handlebars from 'handlebars';
import { TenantsService } from './modules/tenants/tenants.service';
import { PagesService } from './modules/pages/pages.service';
import { SnippetsService } from './modules/snippets/snippets.service';
import { Snippet } from './modules/snippets/snippet.schema';
import { WidgetsService } from './modules/widgets/widgets.service';
import { Widget } from './modules/widgets/widgets.schema';

@Injectable()
export class AppService {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly pagesServices: PagesService,
    private readonly snippetsServices: SnippetsService,
    private readonly widgetsServices: WidgetsService,
    private readonly consoleLogger: ConsoleLogger,
  ) {}

  async getPage(tenantSlug: string, url: string): Promise<HTMLElement> {
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

    const widgtesData = await this.widgetsServices.getWidgetsByTenanId(
      tenantData._id,
    );

    const templateCode: string = pageData.template;
    const template: any = Handlebars.compile(templateCode);

    if (widgtesData.length) {
      widgtesData.forEach((widget: Widget) => {
        Handlebars.registerPartial(
          widget.name,
          this.widgetsServices.partialHelper(
            widget.root,
            widget.indexJs,
            widget.indexCss,
            widget.tenantId.toString(),
            widget.name,
          ),
        );
      });
    }

    if (snippetsData.length) {
      snippetsData.forEach((snippet: Snippet) => {
        Handlebars.registerPartial(snippet.name, snippet.template);
      });
    }

    const result: HTMLElement = template();

    return result;
  }
}
