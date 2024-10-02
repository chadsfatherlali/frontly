import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WidgetsService } from './widgets.service';
import { CreateWidgetDto, UpdateWidgetDto } from './widgets.dto';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';

@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetsServices: WidgetsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<any[]> {
    const result = this.widgetsServices.findAll();

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createWidget(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateWidgetDto,
  ): Promise<any> {
    const result = await this.widgetsServices.createWidget(body, file);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':widgetId')
  @UseInterceptors(FileInterceptor('file'))
  async updateWidget(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateWidgetDto,
    @Param() params: any,
  ): Promise<any> {
    const result = await this.widgetsServices.updateWidget(
      body,
      params.widgetId,
      file,
    );

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':widgetId')
  async deleteWidget(@Param() params: any): Promise<any> {
    const result = await this.widgetsServices.deleteWidget(params.widgetId);

    return result;
  }
}
