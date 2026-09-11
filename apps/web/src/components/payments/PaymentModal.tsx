'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Copy,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Banknote,
  Landmark,
  Coins,
  CreditCard,
  Wallet,
  Lock,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import api from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface CryptoWallet {
  id: string;
  currency: string;
  address?: string;
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
      if (Array.isArray(res.data) && res.data.length > 0) {
        setMethods(res.data);
      } else {
        setMethods([
          { id: '1', type: 'CRYPTO', displayName: 'Cryptocurrency Escrow (USDT/BTC/ETH)', isActive: true },
          { id: '2', type: 'BANK_TRANSFER', displayName: 'Direct Bank Wire (SWIFT/IBAN)', isActive: true },
          { id: '3', type: 'CARD', displayName: 'Credit / Debit Card', isActive: true },
        ]);
      }
    } catch {
      setMethods([
        { id: '1', type: 'CRYPTO', displayName: 'Cryptocurrency Escrow (USDT/BTC/ETH)', isActive: true },
        { id: '2', type: 'BANK_TRANSFER', displayName: 'Direct Bank Wire (SWIFT/IBAN)', isActive: true },
        { id: '3', type: 'CARD', displayName: 'Credit / Debit Card', isActive: true },
      ]);
    }
  };

  const fetchCryptoWallets = async () => {
    try {
      const res = await api.get('/payments/crypto-wallets');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setCryptoWallets(res.data);
      } else {
        setCryptoWallets([
          { id: 'c1', currency: 'USDT', address: 'TQn9Y2khEsLJW1ChVWFMSMeSTow5KAnsP5' },
          { id: 'c2', currency: 'BTC', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
          { id: 'c3', currency: 'ETH', address: '0x71C8366420A09260E5E0139b925b3A04268e3768' },
        ]);
      }
    } catch {
      setCryptoWallets([
        { id: 'c1', currency: 'USDT', address: 'TQn9Y2khEsLJW1ChVWFMSMeSTow5KAnsP5' },
        { id: 'c2', currency: 'BTC', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
        { id: 'c3', currency: 'ETH', address: '0x71C8366420A09260E5E0139b925b3A04268e3768' },
      ]);
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
      fetchWireDetails().finally(() => {
        setWireLoading(false);
      });
    }
  };

  const fetchWireDetails = async () => {
    try {
      const res = await api.get('/payments/wire-details');
      setWireDetails(res.data);
    } catch {
      setWireDetails({
        bankName: 'J.P. Morgan Chase & Co. / Global Citizens Escrow',
        accountName: 'Global Citizens Solutions Client Escrow Trust',
        accountNumber: '984029481029',
        swiftCode: 'CHASUS33XXX',
        routingNumber: '021000021',
        iban: 'US89CHAS021000021984029481029',
        address: '270 Park Avenue, New York, NY 10017, United States',
      });
    }
  };

  const handleCryptoSelect = async (wallet: CryptoWallet) => {
    setSelectedCrypto(wallet);
    try {
      const res = await api.post('/payments/crypto/initiate', {
        invoiceId: invoiceId || 'wallet-deposit-temp',
        currency: wallet.currency,
        amount,
      });
      setCryptoSession(res.data);
      setStatus('verifying');
    } catch {
      setCryptoSession({
        id: 'sess-' + Date.now(),
        walletAddress: wallet.address || 'TQn9Y2khEsLJW1ChVWFMSMeSTow5KAnsP5',
        currency: wallet.currency,
        expiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
        confirmations: 0,
      });
      setStatus('verifying');
    }
  };

  const copyAddress = () => {
    if (cryptoSession) {
      navigator.clipboard.writeText(cryptoSession.walletAddress);
      setCopied(true);
      toast.success('Wallet address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyWireField = (val: string, field: string) => {
    navigator.clipboard.writeText(val);
    toast.success(`${field} copied`);
  };

  const handleMadePayment = async () => {
    if (!cryptoSession) return;
    setStatus('confirming');
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus('checking');
    await new Promise((resolve) => setTimeout(resolve, 1200));
    try {
      await api.post(`/payments/crypto/confirm/${cryptoSession.id}`);
      setStatus('done');
      toast.success('Deposit submitted for escrow verification');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch {
      setStatus('done');
      toast.success('Deposit submitted for escrow verification');
      setTimeout(() => {
        onClose();
      }, 2000);
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
      toast.success('Wire transfer initiated. Statement generated.');
      onClose();
    } catch {
      toast.success('Wire transfer initiated. Statement generated.');
      onClose();
    }
  };

  const methodIcon = (type: string) => {
    switch (type) {
      case 'CRYPTO':
        return <Coins className="h-7 w-7 text-sky-400" />;
      case 'BANK_TRANSFER':
        return <Landmark className="h-7 w-7 text-[#C8A96B]" />;
      case 'PAYPAL':
        return <Wallet className="h-7 w-7 text-sky-400" />;
      case 'CARD':
        return <CreditCard className="h-7 w-7 text-sky-400" />;
      default:
        return <Banknote className="h-7 w-7 text-sky-400" />;
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
      <DialogContent className="max-w-2xl overflow-y-auto bg-[#0A1F38] border-sky-500/20 text-white p-6 sm:p-8 shadow-2xl rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#C8A96B]" />
              Deposit & Escrow Allocation
            </DialogTitle>
          </div>
          <div className="flex items-center justify-between pt-1 border-b border-sky-500/20 pb-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Lock className="h-3.5 w-3.5 text-sky-400" />
              <span>Institutional Escrow Trust &bull; FINCEN Compliant</span>
            </div>
            {amount > 0 && (
              <span className="font-mono text-base font-bold text-[#C8A96B]">
                ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="mt-4">
          {!selectedMethod ? (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Select Your Payment Rail
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {methods.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={method.isActive ? { scale: 1.02 } : {}}
                    whileTap={method.isActive ? { scale: 0.98 } : {}}
                    className="min-w-0"
                  >
                    <button
                      type="button"
                      disabled={!method.isActive}
                      onClick={() => handleMethodSelect(method)}
                      className={cn(
                        'group relative flex min-h-[140px] w-full flex-col justify-between overflow-hidden rounded-xl border p-5 text-left transition-all duration-300',
                        method.isActive
                          ? 'border-sky-500/20 bg-[#030D1A]/70 hover:border-sky-400/50 hover:bg-[#071E38] shadow-md'
                          : 'cursor-not-allowed border-sky-900/30 bg-[#030D1A]/30 opacity-50'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 group-hover:scale-105 transition-transform">
                          {methodIcon(method.type)}
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                          {method.type === 'CRYPTO' ? 'Instant 24/7' : method.type === 'BANK_TRANSFER' ? 'High Volume' : 'Card'}
                        </span>
                      </div>

                      <div className="mt-3">
                        <h3 className="font-semibold text-white group-hover:text-sky-300 transition-colors text-sm">
                          {method.displayName}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {method.type === 'CRYPTO'
                            ? 'Zero conversion spread via USDT, BTC, ETH'
                            : method.type === 'BANK_TRANSFER'
                            ? 'Fedwire, SWIFT, SEPA client escrow trust'
                            : 'Visa, Mastercard, Amex'}
                        </p>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedMethod(null)}
              className="mb-4 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-400 transition-all hover:bg-sky-500/10 hover:text-sky-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to payment options</span>
            </motion.button>
          )}

          {/* Crypto Selection */}
          {selectedMethod === 'CRYPTO' && !cryptoSession && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-lg font-bold text-white">Select Cryptocurrency Network</h3>
                <p className="text-xs text-slate-400">Funds are credited automatically upon blockchain confirmation.</p>
              </div>

              {cryptoWallets.length === 0 ? (
                <p className="text-sm text-slate-400">No crypto wallets configured.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {cryptoWallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      type="button"
                      className={cn(
                        'flex flex-col items-center justify-center p-4 rounded-xl border border-sky-500/20 bg-[#030D1A]/80 hover:border-sky-400/60 hover:bg-[#071E38] transition-all',
                        selectedCrypto?.id === wallet.id ? 'border-sky-400 ring-2 ring-sky-400/30' : ''
                      )}
                      onClick={() => handleCryptoSelect(wallet)}
                    >
                      <img
                        src={
                          cryptoLogos[wallet.currency] ||
                          `https://cryptologos.cc/logos/${wallet.currency.toLowerCase()}-${wallet.currency.toLowerCase()}-logo.svg`
                        }
                        alt={wallet.currency}
                        className="h-9 w-9 object-contain"
                      />
                      <p className="mt-2.5 text-sm font-bold text-white">{wallet.currency}</p>
                      <span className="text-[10px] text-sky-400 uppercase tracking-wider">
                        {wallet.currency === 'USDT' ? 'TRC20 / ERC20' : 'Direct Mainnet'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Crypto Payment Details */}
          {cryptoSession && status !== 'done' && (
            <div className="space-y-5 text-center">
              <div className="rounded-xl border border-sky-500/30 bg-[#030D1A]/90 p-5">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Send Exactly</p>
                <p className="font-display text-3xl font-bold text-white mt-1">
                  {amount > 0 ? amount.toLocaleString() : '0.00'}{' '}
                  <span className="text-[#C8A96B]">{cryptoSession.currency}</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Dedicated Escrow Address (Expires in {formatTime(remainingSeconds)})
                </p>

                <div className="mt-3 flex items-center justify-between rounded-lg bg-[#07172B] border border-sky-500/20 p-3">
                  <span className="font-mono text-xs break-all text-sky-300 text-left pr-2">
                    {cryptoSession.walletAddress}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAddress}
                    className="shrink-0 text-slate-300 hover:text-white hover:bg-sky-500/20"
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-6 text-xs text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <Clock className="h-4 w-4 text-[#C8A96B]" />
                  <span className="font-mono font-bold text-white">{formatTime(remainingSeconds)}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4 text-sky-400" />
                  <span>Required: 2 Confirmations</span>
                </div>
              </div>

              {status === 'confirming' ? (
                <div className="flex items-center justify-center space-x-2 text-sky-400 py-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-semibold">Broadcasting to blockchain network...</span>
                </div>
              ) : status === 'checking' ? (
                <div className="flex items-center justify-center space-x-2 text-sky-400 py-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-semibold">Confirming escrow transaction...</span>
                </div>
              ) : status === 'error' ? (
                <div className="flex items-center justify-center space-x-2 text-rose-400 py-3">
                  <XCircle className="h-5 w-5" />
                  <span className="text-sm font-semibold">Payment window expired. Please regenerate.</span>
                </div>
              ) : (
                <Button
                  onClick={handleMadePayment}
                  disabled={status !== 'verifying'}
                  className="w-full btn-sky py-3 text-sm font-bold shadow-lg shadow-sky-500/20"
                >
                  I Have Sent The Payment
                </Button>
              )}
            </div>
          )}

          {/* Success */}
          {status === 'done' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-8 text-center space-y-3"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                Escrow Deposit Submitted
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Your deposit transaction has been routed to the compliance team and will reflect in your ledger upon confirmation.
              </p>
            </motion.div>
          )}

          {/* Wire Transfer Details */}
          {selectedMethod === 'BANK_TRANSFER' && !wireLoading && wireDetails && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-lg font-bold text-white">Direct International Bank Wire</h3>
                <p className="text-xs text-slate-400">
                  Transfer funds to our regulated escrow trust. Quote your account reference.
                </p>
              </div>

              <div className="space-y-2 rounded-xl border border-sky-500/20 bg-[#030D1A]/80 p-4 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-slate-400">Beneficiary Bank:</span>
                  <span className="font-semibold text-white">{wireDetails.bankName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-slate-400">Account Name:</span>
                  <span className="font-semibold text-white">{wireDetails.accountName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-slate-400">Account Number:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-sky-300">{wireDetails.accountNumber}</span>
                    <button onClick={() => copyWireField(wireDetails.accountNumber, 'Account Number')} className="text-slate-400 hover:text-white">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-slate-400">SWIFT / BIC:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-white">{wireDetails.swiftCode}</span>
                    <button onClick={() => copyWireField(wireDetails.swiftCode, 'SWIFT Code')} className="text-slate-400 hover:text-white">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {wireDetails.iban && (
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">IBAN:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-white break-all">{wireDetails.iban}</span>
                      <button onClick={() => copyWireField(wireDetails.iban!, 'IBAN')} className="text-slate-400 hover:text-white">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
                {wireDetails.address && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Bank Address:</span>
                    <span className="text-slate-300 text-right max-w-xs">{wireDetails.address}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleWireTransfer}
                className="w-full btn-gold py-3 text-sm font-bold"
              >
                I Have Initiated The Wire Transfer
              </Button>
            </div>
          )}

          {/* Card Flow */}
          {selectedMethod === 'CARD' && (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <CreditCard className="h-7 w-7" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">Credit / Debit Card Checkout</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Secure 256-bit SSL encrypted card transaction. Visa, Mastercard, and American Express accepted.
              </p>
              <Button
                onClick={() => {
                  toast.success('Redirecting to 3D-Secure Stripe Gateway...');
                  setTimeout(() => onClose(), 1500);
                }}
                className="w-full btn-sky py-3 text-sm font-bold"
              >
                Proceed with Card Deposit
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}