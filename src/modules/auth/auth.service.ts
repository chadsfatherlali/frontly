import { HttpException, Injectable } from '@nestjs/common';
import { User } from '../users/users.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const result = await this.userRepository.findOneBy({ email });

      if (result && password === result.password) {
        return result;
      }

      return null;
    } catch (err: any) {
      throw new HttpException(err?.message, err?.statusCode);
    }
  }

  async login(body: any) {
    const user: User = await this.userRepository.findOneBy({
      email: body.email,
    });

    const payload = {
      username: user.email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET', ''),
      }),
    };
  }
}