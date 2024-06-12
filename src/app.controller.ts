import { Controller, Get, ConsoleLogger, Res, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly consoleLogger: ConsoleLogger,
    private readonly appService: AppService,
  ) {}

  @Get('site-:siteSlug/:url(*)?')
  async getPage(@Res() res: Response, @Param() params: any): Promise<any> {
    const result = await this.appService.getPage(params.siteSlug, params.url);

    return res.send(result);
  }
}
