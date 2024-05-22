import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './pages.dto';

@Controller('api/v1/pages')
export class PagesController {
  constructor(private readonly pageService: PagesService) {}

  @Post()
  create(@Body() createPageDto: CreatePageDto): Promise<any> {
    const result = this.pageService.create(createPageDto);

    return result;
  }

  @Get(':tenantId')
  findPagesByTenant(@Param() params: any): Promise<any[]> {
    const result = this.pageService.findPagesByTenant(params.tenantId);

    return result;
  }
}
