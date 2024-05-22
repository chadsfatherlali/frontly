import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import Handlebars from 'handlebars';
import { TenantsService } from './modules/tenants/tenants.service';
import { PagesService } from './modules/pages/pages.service';

@Injectable()
export class AppService {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly pagesServices: PagesService,
    private readonly consoleLogger: ConsoleLogger,
  ) {}

  async getPage(tenantSlug: string, url: string): Promise<string> {
    const tenatData = await this.tenantsService.findBySlug(tenantSlug);
    const pageData = await this.pagesServices.findPageByUrlAndTenantId(
      `/${url}`,
      tenatData._id,
    );

    this.consoleLogger.log(
      `======================== ${tenantSlug}/${url} ========================`,
    );
    this.consoleLogger.log(tenatData);
    this.consoleLogger.log(pageData);

    if (!tenatData || !pageData) {
      throw new NotFoundException();
    }

    if (tenatData._id.toString() !== pageData.tenantId.toString()) {
      throw new NotFoundException();
    }

    const templateCode: string = pageData.template;
    const template: any = Handlebars.compile(templateCode);
    const result: any = template();

    return result;
  }
}
