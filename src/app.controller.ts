import {
  Controller,
  Get,
  ConsoleLogger,
  Param,
  Res,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly consoleLogger: ConsoleLogger,
    private readonly appService: AppService,
  ) {}

  @Get(':clientName/:pageName(*)?')
  getPage(
    @Res() res: Response,
    @Query() queryParams: any,
    @Param('clientName') clientName: string,
    @Param('pageName') pageName: string,
  ): any {
    this.consoleLogger.debug(queryParams);
    this.consoleLogger.debug(clientName);
    this.consoleLogger.debug(pageName);

    return res.send(this.appService.getPage());
  }
}
