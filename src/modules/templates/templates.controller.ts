import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './templates.dto';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';

@Controller('api/v1/templates')
export class TemplatesController {
  constructor(private readonly templateService: TemplatesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTemplateDto: CreateTemplateDto): Promise<any> {
    const result = this.templateService.create(createTemplateDto);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<any[]> {
    const result = this.templateService.findAll();

    return result;
  }
}
