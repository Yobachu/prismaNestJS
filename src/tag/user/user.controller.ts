import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './decorators/user.decorator';
import { JwtPayload } from '../../types/interfaces';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/updateUserDto';

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

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User('id') user: JwtPayload) {
    const userData = await this.userService.buildUserResponse(user.id);
    return { user: userData };
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User() currentUser: JwtPayload,
    @Body('user') updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateCurrentUser(
      currentUser.id,
      updateUserDto,
    );
    const userData = await this.userService.buildUserResponse(user.id);
    return { user: userData };
  }
}
