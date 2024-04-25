import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/@database/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private authService: AuthService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.authService.encryptPassword(
      createUserDto.password,
    );

    let createdUserId: number;
    try {
      const data = await this.userRepository.insert({
        ...createUserDto,
        password: hashedPassword,
        isAdmin: false,
      });

      createdUserId = data.raw.insertId;
    } catch (error) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'duplicated entry for the provided username',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }

    return await this.findOne(createdUserId);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    try {
      await this.userRepository.update(id, updateUserDto);
    } catch (error) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'duplicated entry for the provided username',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }
}
