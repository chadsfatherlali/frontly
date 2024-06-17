import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { CreateSnippetDto, UpdateSnippetDto } from './snippets.dto';
import { JwtAuthGuard } from '../auth/local-jwt.guard';

@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSnippetDto: CreateSnippetDto): Promise<any> {
    const result = this.snippetsService.create(createSnippetDto);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findSnippetsByTenant(): Promise<any[]> {
    const result = this.snippetsService.findAll();

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':snippedId')
  updateSnippet(
    @Param() param: any,
    @Body() body: UpdateSnippetDto,
  ): Promise<any> {
    const result = this.snippetsService.updateSnippet(
      param.snippedId,
      body.siteId,
      body.template,
    );

    return result;
  }
}
