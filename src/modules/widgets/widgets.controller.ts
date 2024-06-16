import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WidgetsService } from './widgets.service';
import { CreateWidgetDto } from './widgets.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/widgets')
export class WidgetsController {
  constructor(private readonly widgetsServices: WidgetsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateWidgetDto,
  ): Promise<any> {
    const result = await this.widgetsServices.upload(body, file);

    return result;
  }
}
