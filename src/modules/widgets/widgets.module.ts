import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WidgetsController } from './widgets.controller';
import { WidgetsService } from './widgets.service';
import { Widget, WidgetSchema } from './widgets.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Widget.name, schema: WidgetSchema }]),
  ],
  controllers: [WidgetsController],
  providers: [ConsoleLogger, WidgetsService],
})
export class WidgetsModule {}
