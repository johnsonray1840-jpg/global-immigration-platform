'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Copy, CheckCircle2, XCircle, Loader2, AlertTriangle, Clock,
  ShieldCheck, Banknote, Landmark, Coins, CreditCard, Wallet, Lock, ArrowLeft,
} from 'lucide-react';
import api from '@/lib/api-client';
import { cn } from '@/lib/utils';

// Define the CryptoWallet interface
interface CryptoWallet {
  id: string;
  currency: string;
}

export default function PaymentModal({
  open,
  onClose,
  invoiceId,
  amount,
}: {
  open: boolean;
  onClose: () => void;
  invoiceId: string;
  amount: number;
}) {
  interface PaymentMethodData {
    id: string;
    type: string;
    displayName: string;
    isActive: boolean;
    suspensionMessage?: string;
  }

  const [methods, setMethods] = useState<PaymentMethodData[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoWallet | null>(null);
  interface WireDetails {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode: string;
    routingNumber?: string;
    iban?: string;
    address?: string;
  }

  const [wireDetails, setWireDetails] = useState<WireDetails | null>(null);
  const [wireLoading, setWireLoading] = useState(false);
  // Define the CryptoSession interface
  interface CryptoSession {
    id: string;
    walletAddress: string;
    currency: string;
    expiresAt: string;
    confirmations: number;
  }
  
  const [cryptoSession, setCryptoSession] = useState<CryptoSession | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'confirming' | 'checking' | 'done' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset on close
  useEffect(() => {
    if (!open) resetAll();
  }, [open]);

  // Fetch methods and crypto wallets on open
  useEffect(() => {
    if (open) {
      fetchMethods();
      fetchCryptoWallets();
    }
  }, [open]);

  // Countdown
  useEffect(() => {
    if (cryptoSession && cryptoSession.expiresAt && status === 'verifying') {
      const updateRemaining = () => {
        const diff = Math.max(0, Math.floor((new Date(cryptoSession.expiresAt).getTime() - Date.now()) / 1000));
        setRemainingSeconds(diff);
        if (diff <= 0) {
          clearInterval(timerRef.current!);
          setStatus('error');
          toast.error('Payment session expired');
        }
      };
      updateRemaining();
      timerRef.current = setInterval(updateRemaining, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cryptoSession, status]);

  const resetAll = () => {
    setSelectedMethod(null);
    setSelectedCrypto(null);
    setWireDetails(null);
    setWireLoading(false);
    setCryptoSession(null);
    setRemainingSeconds(0);
    setStatus('idle');
    setCopied(false);
  };

  const fetchMethods = async () => {
    try {
      const res = await api.get('/payments/methods');
      setMethods(res.data);
    } catch {
      toast.error('Failed to load payment methods');
    }
  };

  const fetchCryptoWallets = async () => {
    try {
      const res = await api.get('/payments/crypto-wallets');
      setCryptoWallets(res.data);
    } catch {
      setCryptoWallets([]);
    }
  };

  const handleMethodSelect = (method: PaymentMethodData) => {
    if (!method.isActive) {
      toast.error(
        method.suspensionMessage ||
          'This payment method is temporarily unavailable at this time. Please try again later.'
      );
      return;
    }
    setSelectedMethod(method.type);
    if (method.type === 'BANK_TRANSFER') {
      setWireLoading(true);
      // Simulate generating payment method animation
      setTimeout(async () => {
        await fetchWireDetails();
        setWireLoading(false);
      }, 2000);
    }
  };

  const fetchWireDetails = async () => {
    try {
      const res = await api.get('/payments/wire-details');
      setWireDetails(res.data);
    } catch {
      toast.error('No wire transfer account available for your region');
      setWireDetails(null);
    }
  };

  const handleCryptoSelect = async (wallet: CryptoWallet) => {
    setSelectedCrypto(wallet);
    try {
      const res = await api.post('/payments/crypto/initiate', {
        invoiceId,
        currency: wallet.currency,
        amount,
      });
      setCryptoSession(res.data);
      setStatus('verifying');
    } catch {
      toast.error('Failed to initiate crypto payment');
      setSelectedCrypto(null);
    }
  };

  const copyAddress = () => {
    if (cryptoSession) {
      navigator.clipboard.writeText(cryptoSession.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleMadePayment = async () => {
    if (!cryptoSession) return;
    setStatus('confirming');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus('checking');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    try {
      await api.post(`/payments/crypto/confirm/${cryptoSession.id}`);
      setStatus('done');
      toast.success('Payment submitted for review');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch {
      setStatus('error');
      toast.error('Verification failed');
    }
  };

  const handlePayPal = async () => {
    try {
      await api.post('/payments/paypal/initiate', { invoiceId });
      toast.success('PayPal initiated. Awaiting admin approval.');
      onClose();
    } catch {
      toast.error('Failed to initiate PayPal payment');
    }
  };

  const handleWireTransfer = async () => {
    try {
      await api.post('/payments/wire/initiate', { invoiceId });
      toast.success('Wire transfer initiated. Awaiting admin approval.');
      onClose();
    } catch {
      toast.error('Failed to initiate wire transfer');
    }
  };

  const methodIcon = (type: string) => {
    switch (type) {
      case 'CRYPTO': return <Coins className="h-8 w-8 text-[#0B5D66]" />;
      case 'BANK_TRANSFER': return <Landmark className="h-8 w-8 text-[#0B5D66]" />;
      case 'PAYPAL': return <Wallet className="h-8 w-8 text-[#0B5D66]" />;
      case 'CARD': return <CreditCard className="h-8 w-8 text-[#0B5D66]" />;
      default: return <Banknote className="h-8 w-8 text-[#0B5D66]" />;
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const cryptoLogos: Record<string, string> = {
    BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg',
    USDT: 'https://cryptologos.cc/logos/tether-usdt-logo.svg',
    ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    XRP: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg',
    LTC: 'https://cryptologos.cc/logos/litecoin-ltc-logo.svg',
    XLM: 'https://cryptologos.cc/logos/stellar-xlm-logo.svg',
    BNB: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg',
    DOGE: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-semibold text-[#111827]">
            Choose Payment Method
          </DialogTitle>
          <div className="flex items-center gap-2 text-xs text-[#0B5D66]">
            <Lock className="h-3 w-3" />
            <span>Secured by encryption</span>
          </div>
        </DialogHeader>

        <div className="mt-6">
        {!selectedMethod ? (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {methods.map((method) => (
      <motion.div
        key={method.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={method.isActive ? { y: -4 } : {}}
        whileTap={method.isActive ? { scale: 0.985 } : {}}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="min-w-0"
      >
        <button
          type="button"
          disabled={!method.isActive}
          onClick={() => handleMethodSelect(method)}
          className={cn(
            'group relative flex min-h-[190px] w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl border p-6 text-center',
            'bg-white transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-[#0B5D66]/20 focus:ring-offset-2',

            method.isActive
              ? [
                  'cursor-pointer border-gray-200',
                  'hover:border-[#0B5D66]/30',
                  'hover:shadow-[0_16px_40px_-16px_rgba(11,93,102,0.25)]',
                ]
              : [
                  'cursor-not-allowed border-gray-100 bg-gray-50/70',
                  'opacity-60',
                ]
          )}
        >
          {/* Subtle hover glow */}
          {method.isActive && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0B5D66]/[0.035] via-transparent to-[#C9A96E]/[0.06] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          )}

          {/* Top accent */}
          {method.isActive && (
            <div className="absolute left-1/2 top-0 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#0B5D66] to-[#C9A96E] transition-all duration-300 group-hover:w-16" />
          )}

          {/* Icon */}
          <div
            className={cn(
              'relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl',
              'border transition-all duration-300',
              method.isActive
                ? [
                    'border-[#0B5D66]/10 bg-[#0B5D66]/[0.06]',
                    'group-hover:scale-105 group-hover:border-[#0B5D66]/20',
                    'group-hover:bg-[#0B5D66]/[0.09]',
                  ]
                : 'border-gray-200 bg-gray-100'
            )}
          >
            {methodIcon(method.type)}
          </div>

          {/* Method name */}
          <h3
            className={cn(
              'relative z-10 mt-4 w-full break-words text-center text-base font-semibold leading-snug md:text-[17px]',
              method.isActive
                ? 'text-[#111827] transition-colors group-hover:text-[#0B5D66]'
                : 'text-gray-500'
            )}
          >
            {method.displayName}
          </h3>

          {/* Active indicator */}
          {method.isActive ? (
            <div className="relative z-10 mt-2 flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors group-hover:text-[#0B5D66]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0B5D66] opacity-70" />
              <span>Select method</span>
            </div>
          ) : (
            <div className="relative z-10 mt-2 flex w-full items-center justify-center gap-1.5 text-xs font-medium text-red-500">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Temporarily unavailable</span>
            </div>
          )}
        </button>
      </motion.div>
    ))}
  </div>
) : (
  <motion.button
    type="button"
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.2 }}
    onClick={() => setSelectedMethod(null)}
    className="group mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition-all hover:bg-[#0B5D66]/[0.05] hover:text-[#0B5D66]"
  >
    <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
    <span>Back to methods</span>
  </motion.button>
)}

          {/* Crypto Selection */}
          {selectedMethod === 'CRYPTO' && !cryptoSession && (
            <div>
              <h3 className="font-display text-xl font-semibold text-[#111827]">Select a Network</h3>
              {cryptoWallets.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">No crypto wallets available at the moment.</p>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {cryptoWallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className={cn(
                        'cursor-pointer rounded-xl border border-gray-200 bg-white p-4 text-center transition-all hover:border-[#C9A96E]/50 hover:shadow-md',
                        selectedCrypto?.id === wallet.id ? 'border-[#0B5D66] ring-2 ring-[#0B5D66]/30' : ''
                      )}
                      onClick={() => handleCryptoSelect(wallet)}
                    >
                      <img
                        src={cryptoLogos[wallet.currency] || `https://cryptologos.cc/logos/${wallet.currency.toLowerCase()}-${wallet.currency.toLowerCase()}-logo.svg`}
                        alt={wallet.currency}
                        className="mx-auto h-8 w-8"
                      />
                      <p className="mt-2 text-sm font-medium text-gray-800">{wallet.currency}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Crypto Payment Details */}
          {cryptoSession && status !== 'done' && (
            <div className="text-center">
              <h3 className="font-display text-xl font-semibold text-[#111827]">
                Complete Your Payment
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Send exactly {amount} {cryptoSession.currency} to the address below
              </p>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-[#F8FAFA] p-4">
                <div className="font-mono text-sm break-all text-[#111827]">
                  {cryptoSession.walletAddress}
                </div>
                <Button variant="ghost" size="icon" onClick={copyAddress}>
                  {copied ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>

              <div className="mt-4 flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-[#0B5D66]" />
                  <span className="font-medium text-[#111827]">{formatTime(remainingSeconds)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-[#0B5D66]" />
                  <span className="text-[#111827]">Confirmations: {cryptoSession.confirmations}/5</span>
                </div>
              </div>

              {status === 'confirming' ? (
                <div className="mt-6 flex items-center justify-center space-x-2 text-[#0B5D66]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verifying payment...</span>
                </div>
              ) : status === 'checking' ? (
                <div className="mt-6 flex items-center justify-center space-x-2 text-[#0B5D66]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Checking confirmation...</span>
                </div>
              ) : status === 'error' ? (
                <div className="mt-6 flex items-center justify-center space-x-2 text-red-500">
                  <XCircle className="h-5 w-5" />
                  <span>Payment session expired or failed</span>
                </div>
              ) : (
                <Button
                  onClick={handleMadePayment}
                  disabled={status !== 'verifying'}
                  className="mt-6 bg-[#0B5D66] text-white hover:bg-[#0A4E56] disabled:opacity-50"
                >
                  I have made the payment
                </Button>
              )}
            </div>
          )}

          {/* Success */}
          {status === 'done' && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="py-8 text-center"
            >
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <h3 className="mt-4 font-display text-2xl font-semibold text-[#111827]">
                Payment Submitted for Review
              </h3>
              <p className="mt-2 text-gray-500">
                Our Payment Verification Team will confirm shortly.
              </p>
            </motion.div>
          )}

          {/* Wire Transfer Generating Animation */}
          {selectedMethod === 'BANK_TRANSFER' && wireLoading && (
            <div className="py-8 text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#0B5D66]" />
              <p className="mt-4 text-gray-600">Generating your payment method...</p>
            </div>
          )}

          {/* Wire Transfer Details */}
          {selectedMethod === 'BANK_TRANSFER' && !wireLoading && wireDetails && (
            <div>
              <h3 className="font-display text-xl font-semibold text-[#111827]">
                Wire Transfer Details
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Please transfer the exact amount to the account below. Use your invoice ID as reference.
              </p>
              <div className="mt-4 space-y-2 rounded-lg bg-[#F8FAFA] p-4">
                <p className="text-[#111827]"><span className="font-medium">Bank:</span> {wireDetails.bankName}</p>
                <p className="text-[#111827]"><span className="font-medium">Account Name:</span> {wireDetails.accountName}</p>
                <p className="text-[#111827]"><span className="font-medium">Account Number:</span> {wireDetails.accountNumber}</p>
                <p className="text-[#111827]"><span className="font-medium">SWIFT Code:</span> {wireDetails.swiftCode}</p>
                {wireDetails.routingNumber && <p className="text-[#111827]"><span className="font-medium">Routing Number:</span> {wireDetails.routingNumber}</p>}
                {wireDetails.iban && <p className="text-[#111827]"><span className="font-medium">IBAN:</span> {wireDetails.iban}</p>}
                {wireDetails.address && <p className="text-[#111827]"><span className="font-medium">Bank Address:</span> {wireDetails.address}</p>}
              </div>
              <Button
                onClick={handleWireTransfer}
                className="mt-6 bg-[#0B5D66] text-white hover:bg-[#0A4E56]"
              >
                I have initiated the transfer
              </Button>
            </div>
          )}

          {/* PayPal */}
          {/* {selectedMethod === 'PAYPAL' && (
            <div className="text-center">
              <h3 className="font-display text-xl font-semibold text-[#111827]">PayPal</h3>
              <p className="mt-2 text-sm text-gray-500">You will be redirected to PayPal to complete your payment.</p>
              <Button
                onClick={handlePayPal}
                className="mt-6 bg-[#0B5D66] text-white hover:bg-[#0A4E56]"
              >
                Continue to PayPal
              </Button>
            </div>
          )} */}
        </div>
      </DialogContent>
    </Dialog>
  );
}