import { Controller, Get, ConsoleLogger, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly consoleLogger: ConsoleLogger,
    private readonly appService: AppService,
  ) {}

  @Get('site-:tenantSlug/:page(*)?')
  async getPage(
    @Res() res: Response,
    @Param('tenantSlug') tenantSlug: string,
    @Param('page') page: string,
  ): Promise<any> {
    const result = await this.appService.getPage(tenantSlug, page);

    return res.send(result);
  }
}
