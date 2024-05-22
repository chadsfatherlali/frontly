import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Page, PageSchema } from 'src/schemas/page.schema';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';

@Module({
  imports: [
    PagesModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
  ],
  controllers: [PagesController],
  providers: [ConsoleLogger, PagesService],
})
export class PagesModule {}
