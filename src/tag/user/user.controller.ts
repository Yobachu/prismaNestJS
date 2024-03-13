import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}
  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const user = await this.userService.createUser(createUserDto);
    return { user };
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(@Body('user') { email, password }) {
    const user = await this.userService.login(email, password);
    return { user };
  }
}
