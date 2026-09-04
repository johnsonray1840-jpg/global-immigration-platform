import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getWallet(@Req() req) {
    return this.walletService.getWallet(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  async getTransactions(@Req() req) {
    return this.walletService.getTransactionHistory(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  async deposit(
    @Req() req,
    @Body() body: { amount: number; paymentMethodId: string },
  ) {
    return this.walletService.requestDeposit(req.user.id, body.amount, body.paymentMethodId);
  }
}