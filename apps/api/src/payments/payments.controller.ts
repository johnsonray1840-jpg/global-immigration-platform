import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';


@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('methods')
  async getMethods() {
    return this.paymentsService.getPaymentMethods();
  }

  @UseGuards(JwtAuthGuard)
  @Post('invoice')
  async createInvoice(@Req() req, @Body() body: any) {
    return this.paymentsService.createInvoice(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('wire-details')
  async getWireDetails(@Req() req) {
    return this.paymentsService.getWireDetails(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('crypto/initiate')
  async initCrypto(@Req() req, @Body() body: { invoiceId: string; currency: string; amount: number }) {
    return this.paymentsService.initCryptoPayment(req.user.id, body.invoiceId, body.currency, body.amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post('crypto/confirm/:sessionId')
  async confirmCrypto(@Req() req, @Param('sessionId') sessionId: string) {
    return this.paymentsService.confirmCryptoPayment(sessionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('paypal/initiate')
  async initPaypal(@Req() req, @Body() body: { invoiceId: string }) {
    return this.paymentsService.initPayPalPayment(req.user.id, body.invoiceId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('wire/initiate')
  async initWire(@Req() req, @Body() body: { invoiceId: string }) {
    return this.paymentsService.initiateWireTransfer(req.user.id, body.invoiceId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('request-approval')
  async requestApproval(@Req() req, @Body() body: { invoiceId: string; paymentMethodId?: string }) {
    return this.paymentsService.requestApproval(body.invoiceId, req.user.id, body.paymentMethodId);
  }

  @Get('crypto-wallets')
async getCryptoWallets() {
  return this.paymentsService.getActiveCryptoWallets();
}

}