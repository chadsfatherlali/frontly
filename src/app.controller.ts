import { Controller, Get, ConsoleLogger, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly consoleLogger: ConsoleLogger,
    private readonly appService: AppService,
  ) {}

  @Get('site-:tenantSlug/:page(*)?')
  async getPage(@Res() res: Response): Promise<any> {
    const result = await this.appService.getPage();

    return res.send(result);
  }
}
