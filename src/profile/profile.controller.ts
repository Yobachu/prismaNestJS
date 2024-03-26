import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '../user/decorators/user.decorator';
import { JwtPayload } from '../types/interfaces';
import { ProfileType } from './type/profile.type';
import { ProfileService } from './profile.service';
import { AuthGuard } from '../user/guards/auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @User() currentUser: JwtPayload,
    @Param('username') username: string,
  ) {
    const profile = await this.profileService.getProfile(currentUser, username);
    return profile;
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User() currentUser: JwtPayload,
    @Param('username') username: string,
  ) {
    const profile = await this.profileService.followProfile(
      currentUser,
      username,
    );
    return profile;
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollowProfile(
    @User() currentUser: JwtPayload,
    @Param('username') username: string,
  ) {
    const profile = await this.profileService.unfollowProfile(
      currentUser,
      username,
    );
    return profile;
  }
}
