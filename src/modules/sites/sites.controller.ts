import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './sites.dto';
import { AuthGuard } from '@nestjs/passport';

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
}
