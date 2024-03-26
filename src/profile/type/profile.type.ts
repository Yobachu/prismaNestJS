import { User } from '@prisma/client';

export type ProfileType = User & { following: boolean };
