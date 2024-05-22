import { Body, Controller, Get, Post } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './tenants.dto';

@Controller('api/v1/tenants')
export class TenantsController {
  constructor(private readonly tentatsService: TenantsService) {}

  @Post()
  create(@Body() createTenantDto: CreateTenantDto): Promise<any> {
    const result = this.tentatsService.create(createTenantDto);

    return result;
  }

  @Get()
  findAll(): Promise<any[]> {
    const result = this.tentatsService.findAll();

    return result;
  }
}
