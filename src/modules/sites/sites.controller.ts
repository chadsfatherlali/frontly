import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './sites.dto';
import { AuthGuard } from '@nestjs/passport';
import { Site } from './sites.schema';

@Controller('api/v1/sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createSiteDto: CreateSiteDto): Promise<any> {
    const result = this.sitesService.create(createSiteDto);

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(): Promise<any[]> {
    const result = this.sitesService.findAll();

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':slug')
  findBySlug(@Param() params: any): Promise<Site> {
    const result = this.sitesService.findBySlug(params.slug);

    return result;
  }
}
