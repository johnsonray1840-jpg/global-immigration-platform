"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const wallets = [
        { currency: 'BTC', address: 'YOUR_BTC_ADDRESS' },
        { currency: 'USDT', address: 'YOUR_USDT_ADDRESS' },
        { currency: 'ETH', address: 'YOUR_ETH_ADDRESS' },
        { currency: 'XRP', address: 'YOUR_XRP_ADDRESS' },
        { currency: 'LTC', address: 'YOUR_LTC_ADDRESS' },
        { currency: 'XLM', address: 'YOUR_XLM_ADDRESS' },
        { currency: 'BNB', address: 'YOUR_BNB_ADDRESS' },
        { currency: 'DOGE', address: 'YOUR_DOGE_ADDRESS' },
    ];
    for (const w of wallets) {
        await prisma.cryptoWallet.upsert({
            where: { id: w.currency },
            update: { address: w.address, isActive: true },
            create: { currency: w.currency, address: w.address },
        });
    }
    console.log('Crypto wallets seeded');
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=seed-crypto-wallets.js.map