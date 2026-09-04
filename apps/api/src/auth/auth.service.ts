import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dto.password, salt);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hash,
        verificationCode: code,
        verificationCodeExpires: expires,
      },
    });

    await this.mailService.sendVerificationCode(user.email, code);

    return {
      success: true,
      userId: user.id,
      message: 'Verification code sent to your email',
      ...(process.env.DEV_MODE === 'true' ? { devCode: code } : {}),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.passwordHash) throw new UnauthorizedException('No password set for this account');

    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }
    if (user.twoFactorEnabled) {
      return { requiresTwoFactor: true, userId: user.id };
    }

    return {
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email }),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  generateToken(user: any) {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }

  async generateTwoFactorSecret(userId: string) {
    const secret = speakeasy.generateSecret({ length: 20 });
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 },
    });
    return { secret: secret.base32, otpauthUrl: secret.otpauth_url };
  }

  async verifyTwoFactorToken(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) throw new UnauthorizedException('2FA not set up');

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });
    if (!verified) throw new UnauthorizedException('Invalid 2FA token');

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });
    return { success: true };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { success: true };
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetCode: code, resetCodeExpires: new Date(Date.now() + 15*60*1000) },
    });
    await this.mailService.sendPasswordResetCode(email, code);
    return { success: true };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.resetCode || user.resetCode !== code) {
      throw new UnauthorizedException('Invalid reset code');
    }
    if (user.resetCodeExpires && user.resetCodeExpires < new Date()) {
      throw new UnauthorizedException('Reset code expired');
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hash, resetCode: null, resetCodeExpires: null },
    });
    return { success: true };
  }

  // 
  async verifyLoginTwoFactor(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) throw new UnauthorizedException('2FA not set up');
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });
    if (!verified) throw new UnauthorizedException('Invalid 2FA token');
    return {
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email }),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async verifyEmail(identifier: string, code: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ id: identifier }, { email: identifier }],
      },
    });
    if (!user || !user.verificationCode || user.verificationCode !== code) {
      throw new UnauthorizedException('Invalid verification code');
    }
    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      throw new UnauthorizedException('Verification code expired');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      },
    });

    return {
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email }),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async resendVerificationCode(identifier: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ id: identifier }, { email: identifier }],
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    if (user.isEmailVerified) throw new BadRequestException('Email already verified');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { verificationCode: code, verificationCodeExpires: expires },
    });

    await this.mailService.sendVerificationCode(user.email, code);

    return {
      success: true,
      message: 'New verification code sent to your email',
      ...(process.env.DEV_MODE === 'true' ? { devCode: code } : {}),
    };
  }


// disable two-factor authentication for a user
async disableTwoFactor(userId: string) {
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  if (!user?.twoFactorEnabled) {
    throw new BadRequestException('Two-factor authentication is not enabled');
  }
  await this.prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    },
  });
  return { success: true, message: 'Two-factor authentication disabled' };
}
}