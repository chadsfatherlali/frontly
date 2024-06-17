import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import Handlebars from 'handlebars';
import { SitesService } from './modules/sites/sites.service';
import { Snippet } from './modules/snippets/snippet.schema';
import { WidgetsService } from './modules/widgets/widgets.service';

@Injectable()
export class AppService {
  constructor(
    private readonly sitesServices: SitesService,
    private readonly widgetsServices: WidgetsService,
  ) {}

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

      const templateString: string = template.template;
      const templateHtml: any = Handlebars.compile(templateString);

      if (site.widgets.length) {
        site.widgets.forEach((widget: any) => {
          Handlebars.registerPartial(
            widget.name,
            this.widgetsServices.partialHelper(
              widget.root,
              widget.indexJs,
              widget.indexCss,
              site.id,
              widget.name,
            ),
          );
        });
      }

      if (site.snippets.length) {
        site.snippets.forEach((snippet: Snippet) => {
          Handlebars.registerPartial(snippet.name, snippet.template);
        });
      }

      const result: HTMLElement = templateHtml({
        user: { ...site.user },
        page: { ...page },
      });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.status);
    }
  }
}
