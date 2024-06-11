import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { AssignTemplateDto, CreatePageDto } from './pages.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/pages')
export class PagesController {
  constructor(private readonly pageService: PagesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createPageDto: CreatePageDto): Promise<any> {
    const result = this.pageService.create(createPageDto);

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(): Promise<any[]> {
    const result = this.pageService.findAll();

    return result;
  }

  @Get(':id')
  findById(@Param() params: any): Promise<any> {
    const result = this.pageService.findOneById(params.id);

    return result;
  }

  @Patch(':pageId')
  assignTemaplte(
    @Param() params: any,
    @Body() body: AssignTemplateDto,
  ): Promise<any> {
    const result = this.pageService.assignTemplate(
      params.pageId,
      body.templateId,
    );

    return result;
  }
}
