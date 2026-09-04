import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const token = this.authService.generateToken(req.user);
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  generate2fa(@Req() req) {
    return this.authService.generateTwoFactorSecret(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/verify')
  verify2fa(@Req() req, @Body() body: { token: string }) {
    return this.authService.verifyTwoFactorToken(req.user.id, body.token);
  }

  @UseGuards(JwtAuthGuard)
@Post('2fa/disable')
async disable2fa(@Req() req) {
  return this.authService.disableTwoFactor(req.user.id);
}

  @Post('verify-email')
  async verifyEmail(@Body() body: { userId: string; code: string }) {
    return this.authService.verifyEmail(body.userId, body.code);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; code: string; newPassword: string }) {
    return this.authService.resetPassword(body.email, body.code, body.newPassword);
  }

  @Post('2fa/verify-login')
  async verifyLogin(@Body() body: { userId: string; token: string }) {
    return this.authService.verifyLoginTwoFactor(body.userId, body.token);
  }

  @Post('resend-verification')
  async resendVerification(@Body() body: { userId: string }) {
    return this.authService.resendVerificationCode(body.userId);
  }
}