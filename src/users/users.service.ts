import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/@database/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    let createdUserId: number;
    try {
      const data = await this.userRepository.insert({
        ...createUserDto,
        password: hashedPassword,
        isAdmin: false,
      });

      createdUserId = data.raw?.[0]?.id;
    } catch (error) {
      if (error?.constraint?.startsWith('UQ_')) {
        throw new HttpException(
          'duplicated entry for the provided username',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }

    return await this.findOne(createdUserId);
  }

  async findAll() {
    const users = await this.userRepository.find({
      order: {
        firstName: 'ASC',
      },
    });
    return [
      ...users.filter((u) => u.isAdmin),
      ...users.filter((u) => !u.isAdmin),
    ];
  }

  async findOne(id: number) {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
  }

  async findOneByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
      select: { password: true, id: true, isAdmin: true, username: true },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.userRepository.update(id, updateUserDto);
      return await this.findOne(id);
    } catch (error) {
      if (error?.constraint?.startsWith('UQ_')) {
        throw new HttpException(
          'duplicated entry for the provided username',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }
}
