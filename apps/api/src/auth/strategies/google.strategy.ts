import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID') || 'google-client-id-placeholder';
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET') || 'google-client-secret-placeholder';

    if (!configService.get<string>('GOOGLE_CLIENT_ID') || !configService.get<string>('GOOGLE_CLIENT_SECRET')) {
      console.warn('⚠️ Google OAuth is using placeholder credentials. Social login will not work until real credentials are set.');
    }

    super({
      clientID,
      clientSecret,
      callbackURL: 'http://localhost:3001/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const { id, emails, displayName } = profile;
    const email = emails?.[0]?.value;

    if (!email) {
      return done(new Error('No email found from Google'), undefined);
    }

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          googleId: id,
          isEmailVerified: true,
          profile: {
            create: {
              firstName: displayName || '',
              lastName: '',
            },
          },
        },
      });
    } else if (!user.googleId) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: id },
      });
    }

    done(null, user);
  }
}