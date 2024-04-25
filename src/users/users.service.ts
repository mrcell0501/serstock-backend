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

  async findOneByUsername(username: string) {
    const { id, password } = await this.userRepository.findOne({
      where: { username },
      select: { password: true, id: true },
    });

    if (!password) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    return { id, username, password };
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
