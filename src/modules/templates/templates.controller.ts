import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './templates.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/templates')
export class TemplatesController {
  constructor(private readonly templateService: TemplatesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createTemplateDto: CreateTemplateDto): Promise<any> {
    const result = this.templateService.create(createTemplateDto);

    return result;
  }

  /* @Get(':tenantId')
  findPagesByTenant(@Param() params: any): Promise<any[]> {
    const result = this.pageService.findPagesByTenant(params.tenantId);

    return result;
  } */

  /* @Patch()
  updatePage(@Body() updatePage: UpdatePageDto): Promise<any> {
    const result = this.pageService.updatePage(updatePage);

    return result;
  } */
}
