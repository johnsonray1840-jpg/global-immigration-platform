import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private mailService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailService: MailService);
    register(dto: RegisterDto): Promise<{
        devCode?: string | undefined;
        success: boolean;
        userId: string;
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        requiresTwoFactor: boolean;
        userId: string;
        accessToken?: undefined;
        user?: undefined;
    } | {
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
        requiresTwoFactor?: undefined;
        userId?: undefined;
    }>;
    generateToken(user: any): string;
    generateTwoFactorSecret(userId: string): Promise<{
        secret: string;
        otpauthUrl: string | undefined;
    }>;
    verifyTwoFactorToken(userId: string, token: string): Promise<{
        success: boolean;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
    }>;
    resetPassword(email: string, code: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    verifyLoginTwoFactor(userId: string, token: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    verifyEmail(identifier: string, code: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    resendVerificationCode(identifier: string): Promise<{
        devCode?: string | undefined;
        success: boolean;
        message: string;
    }>;
    disableTwoFactor(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
