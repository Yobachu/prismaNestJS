import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtPayload } from '../types/interfaces';
import { ProfileType } from './type/profile.type';
import { User } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(currentUser: JwtPayload, username: string) {
    const profiles = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        bio: true,
        image: true,
        isCompany: true,
      },
    });
    if (!profiles) {
      throw new HttpException('Profile doesn not exist', HttpStatus.NOT_FOUND);
    }
    if (!currentUser) {
      return { profile: { ...profiles, following: false } };
    }
    const existingFollow = await this.prisma.follow.findFirst({
      where: {
        followerId: currentUser.id,
        followingId: profiles.id,
      },
    });

    const profile: Partial<ProfileType> = {
      ...profiles,
      following: !!existingFollow,
    };
    return { profile: profile };
  }

  async followProfile(currentUser: JwtPayload, username: string) {
    const profiles = await this.prisma.user.findUnique({
      where: {
        username: username,
        isCompany: true,
      },
      select: {
        id: true,
        username: true,
        bio: true,
        image: true,
      },
    });
    if (!profiles) {
      throw new HttpException(
        'Profile doesn not exist or is not a company',
        HttpStatus.NOT_FOUND,
      );
    }
    if (currentUser.id === profiles.id) {
      throw new HttpException(
        'Follower and following cant be equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingFollow = await this.prisma.follow.findFirst({
      where: {
        followerId: currentUser.id,
        followingId: profiles.id,
      },
    });
    if (existingFollow) {
      throw new HttpException('You already following', HttpStatus.BAD_REQUEST);
    }
    const follow = await this.prisma.follow.create({
      data: {
        followerId: currentUser.id,
        followingId: profiles.id,
      },
    });
    if (follow) {
      const profile: Partial<ProfileType> = {
        ...profiles,
        following: true,
      };
      console.log(
        'на кого подписались',
        profile,
        'кто подписался',
        currentUser,
      );
      return { profile: profile };
    }
  }
  async unfollowProfile(currentUser: JwtPayload, username: string) {
    const profiles = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        bio: true,
        image: true,
      },
    });
    if (!profiles) {
      throw new HttpException('Profile doesn not exist', HttpStatus.NOT_FOUND);
    }
    if (currentUser.id === profiles.id) {
      throw new HttpException(
        'Follower and following cant be equal',
        HttpStatus.BAD_REQUEST,
      );
    }
    const existingFollow = await this.prisma.follow.findFirst({
      where: {
        followerId: currentUser.id,
        followingId: profiles.id,
      },
    });
    if (existingFollow) {
      await this.prisma.follow.deleteMany({
        where: {
          followerId: currentUser.id,
          followingId: profiles.id,
        },
      });
      const profile: Partial<ProfileType> = {
        ...profiles,
        following: false,
      };
      console.log(
        'на кого подписались',
        profile,
        'кто подписался',
        currentUser,
      );
      return { profile: profile };
    }
  }
}
