import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

export const roundsOfHashing = 10;
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );
    try {
      createUserDto.password = hashedPassword;
      const user = await this.prisma.user.create({
        data: createUserDto,
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException(
          'Email or Username are taken',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async login(email, password) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new HttpException('No user found', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const passwordValid = await compare(password, user.password);
    if (!passwordValid) {
      throw new HttpException(
        'Invalid password',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    const token = await this.jwtService.sign(user);
    delete user.password;
    return { ...user, token };
  }

  async updateCurrentUser(id: number, updateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        ...updateUserDto,
      },
    });
    return user;
  }

  async buildUserResponse(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    const token = await this.jwtService.sign({ id: user.id });
    delete user.password;
    return { ...user, token };
  }
}
