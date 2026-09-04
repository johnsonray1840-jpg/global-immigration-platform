"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const speakeasy = __importStar(require("speakeasy"));
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const common_2 = require("@nestjs/common");
let AuthService = class AuthService {
    prisma;
    jwtService;
    mailService;
    constructor(prisma, jwtService, mailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Email already exists');
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
    async login(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!user.passwordHash)
            throw new common_1.UnauthorizedException('No password set for this account');
        const match = await bcrypt.compare(dto.password, user.passwordHash);
        if (!match)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!user.isEmailVerified) {
            throw new common_1.UnauthorizedException('Please verify your email first');
        }
        if (user.twoFactorEnabled) {
            return { requiresTwoFactor: true, userId: user.id };
        }
        return {
            accessToken: this.jwtService.sign({ sub: user.id, email: user.email }),
            user: { id: user.id, email: user.email, role: user.role },
        };
    }
    generateToken(user) {
        return this.jwtService.sign({ sub: user.id, email: user.email });
    }
    async generateTwoFactorSecret(userId) {
        const secret = speakeasy.generateSecret({ length: 20 });
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: secret.base32 },
        });
        return { secret: secret.base32, otpauthUrl: secret.otpauth_url };
    }
    async verifyTwoFactorToken(userId, token) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.twoFactorSecret)
            throw new common_1.UnauthorizedException('2FA not set up');
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token,
        });
        if (!verified)
            throw new common_1.UnauthorizedException('Invalid 2FA token');
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: true },
        });
        return { success: true };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return { success: true };
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await this.prisma.user.update({
            where: { id: user.id },
            data: { resetCode: code, resetCodeExpires: new Date(Date.now() + 15 * 60 * 1000) },
        });
        await this.mailService.sendPasswordResetCode(email, code);
        return { success: true };
    }
    async resetPassword(email, code, newPassword) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.resetCode || user.resetCode !== code) {
            throw new common_1.UnauthorizedException('Invalid reset code');
        }
        if (user.resetCodeExpires && user.resetCodeExpires < new Date()) {
            throw new common_1.UnauthorizedException('Reset code expired');
        }
        const hash = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: hash, resetCode: null, resetCodeExpires: null },
        });
        return { success: true };
    }
    async verifyLoginTwoFactor(userId, token) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.twoFactorSecret)
            throw new common_1.UnauthorizedException('2FA not set up');
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token,
        });
        if (!verified)
            throw new common_1.UnauthorizedException('Invalid 2FA token');
        return {
            accessToken: this.jwtService.sign({ sub: user.id, email: user.email }),
            user: { id: user.id, email: user.email, role: user.role },
        };
    }
    async verifyEmail(identifier, code) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ id: identifier }, { email: identifier }],
            },
        });
        if (!user || !user.verificationCode || user.verificationCode !== code) {
            throw new common_1.UnauthorizedException('Invalid verification code');
        }
        if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
            throw new common_1.UnauthorizedException('Verification code expired');
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
    async resendVerificationCode(identifier) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ id: identifier }, { email: identifier }],
            },
        });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        if (user.isEmailVerified)
            throw new common_2.BadRequestException('Email already verified');
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
    async disableTwoFactor(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.twoFactorEnabled) {
            throw new common_2.BadRequestException('Two-factor authentication is not enabled');
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map