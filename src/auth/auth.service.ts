import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async comparePasswords(password: string, hashValue: string) {
    return bcrypt.compare(password, hashValue);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findOneByUsername(dto.username);
    const passwordsMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordsMatch) {
      throw new HttpException('fields do not match', HttpStatus.BAD_REQUEST);
    }

    const tokenInfo = {
      sub: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };
    const accessToken = await this.jwtService.signAsync(tokenInfo);

    return { tokenInfo, accessToken };
  }
}
