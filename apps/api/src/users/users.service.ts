import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async updateProfile(userId: string, data: any) {
    await this.prisma.userProfile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
    return this.getProfile(userId);
  }

  async completeOnboarding(userId: string, dto: CompleteOnboardingDto) {
    const data: any = { ...dto };

    if (dto.dateOfBirth) {
      data.dateOfBirth = new Date(dto.dateOfBirth);
    }

    await this.prisma.userProfile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: true },
    });

    return this.getProfile(userId);
  }
}