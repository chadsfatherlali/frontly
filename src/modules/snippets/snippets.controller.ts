import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { CreateSnippetDto } from './snippets.dto';

@Controller('api/v1/snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Post()
  create(@Body() createSnippetDto: CreateSnippetDto): Promise<any> {
    const result = this.snippetsService.create(createSnippetDto);

    return result;
  }

  @Get(':tenantId')
  findSnippetsByTenant(@Param() params: any): Promise<any[]> {
    const result = this.snippetsService.findSnippetsByTenant(params.tenantId);

    return result;
  }
}
