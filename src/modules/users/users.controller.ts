import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';
import { JwtAuthGuard } from '../auth/local-jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<any> {
    const result = this.usersService.create(createUserDto);

    return result;
  }

  @Get(':id')
  findById(@Param() params: any): Promise<any> {
    const result = this.usersService.findOneById(params.id);

    return result;
  }

  @Get()
  findAll(): Promise<any[]> {
    const result = this.usersService.findAll();

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  addSite(@Body() siteId: string): Promise<any> {
    const result = this.usersService.addSite(siteId);

    return result;
  }
}
