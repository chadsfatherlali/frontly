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
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createSnippetDto: CreateSnippetDto): Promise<any> {
    const result = this.snippetsService.create(createSnippetDto);

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findSnippetsByTenant(): Promise<any[]> {
    const result = this.snippetsService.findAll();

    return result;
  }

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
