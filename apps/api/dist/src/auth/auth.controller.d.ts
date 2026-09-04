import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any, res: Response): Promise<void>;
    generate2fa(req: any): Promise<{
        secret: string;
        otpauthUrl: string | undefined;
    }>;
    verify2fa(req: any, body: {
        token: string;
    }): Promise<{
        success: boolean;
    }>;
    disable2fa(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyEmail(body: {
        userId: string;
        code: string;
    }): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
    }>;
    resetPassword(body: {
        email: string;
        code: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
    }>;
    verifyLogin(body: {
        userId: string;
        token: string;
    }): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    resendVerification(body: {
        userId: string;
    }): Promise<{
        devCode?: string | undefined;
        success: boolean;
        message: string;
    }>;
}
