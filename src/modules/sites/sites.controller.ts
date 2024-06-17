import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './sites.dto';
import { Site } from './sites.schema';
import { JwtAuthGuard } from '../auth/local-jwt.guard';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSiteDto: CreateSiteDto): Promise<any> {
    const result = this.sitesService.create(createSiteDto);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<any[]> {
    const result = this.sitesService.findAll();

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':slug')
  findBySlug(@Param() params: any): Promise<Site> {
    const result = this.sitesService.findBySlug(params.slug);

    return result;
  }
}
