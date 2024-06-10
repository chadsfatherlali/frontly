import { HttpException, Inject, Injectable, Scope } from '@nestjs/common';
import { User } from './users.schema';
import { CreateUserDto } from './users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/interfaces/custom-request.interface';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @Inject(REQUEST) private request: CustomRequest,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const result = await this.userRepository.save(createUserDto);

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      const result = await this.userRepository.findOne({
        where: { id },
        relations: ['sites'],
      });

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const result = await this.userRepository.find();

      return result;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async addSite(siteId: string): Promise<any> {
    try {
      console.log(this.request.user.userId);

      return siteId;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }
}
