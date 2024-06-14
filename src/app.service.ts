import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import Handlebars from 'handlebars';
import { SitesService } from './modules/sites/sites.service';
import { Snippet } from './modules/snippets/snippet.schema';

@Injectable()
export class AppService {
  constructor(private readonly sitesServices: SitesService) {}

  async getPage(siteSlug: string, url: string): Promise<HTMLElement> {
    try {
      const site = await this.sitesServices.findBySlug(siteSlug);

      if (!site) {
        throw new NotFoundException();
      }

      const page = site.pages.filter((page) => page.url === `/${url}`)[0];

      if (!page) {
        throw new NotFoundException();
      }

      const template = site.templates.filter(
        (template) => template.id === page.templateId,
      )[0];

      if (!template) {
        throw new NotFoundException();
      }

      /* const tenantData = await this.tenantsService.findBySlug(tenantSlug);
      const pageData = await this.pagesServices.findPageByUrlAndTenantId(
        `/${url}`,
        tenantData.id,
      );

      this.consoleLogger.log(
        `======================== ${tenantSlug}/${url} ========================`,
      );
      this.consoleLogger.log(tenantData);
      this.consoleLogger.log(pageData);

      if (!tenantData || !pageData) {
        throw new NotFoundException();
      }

      if (tenantData.id.toString() !== pageData.tenantId.toString()) {
        throw new NotFoundException();
      }

      const snippetsData = await this.snippetsServices.findSnippetsByTenant(
        tenantData.id,
      ); */

      const templateString: string = template.template;
      const templateHtml: any = Handlebars.compile(templateString);

      /* if (pageData.widgets.length) {
        pageData.widgets.forEach((widget: Widget) => {
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
      } */

      if (site.snippets.length) {
        site.snippets.forEach((snippet: Snippet) => {
          Handlebars.registerPartial(snippet.name, snippet.template);
        });
      }

      const result: HTMLElement = templateHtml();

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.status);
    }
  }
}
