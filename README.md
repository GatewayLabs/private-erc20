# Encrypted ERC20 Transfer dApp

A modern, secure dApp for managing and transferring ERC20 tokens with privacy using Paillier homomorphic encryption. This application ensures that both token balances and transfer amounts remain private and hidden from block explorers and the mempool.

## Features

- 🔒 **Secure Token Transfers**: Uses Paillier encryption for confidential balances and transfer amounts
- 🪙 **Token Management**: Use default token or deploy your own ERC20 token
- 👛 **Wallet Integration**: Seamless connection with popular wallets via RainbowKit
- 📊 **Real-time Updates**: Live transaction history and balance updates
- 🎨 **Modern UI**: Clean, professional interface styled with Tailwind CSS
- ♿ **Accessibility**: Full keyboard navigation and ARIA support

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Blockchain Integration**: 
  - wagmi
  - RainbowKit
  - viem/ethers.js
- **Smart Contracts**: Custom Paillier homomorphic encryption contract
- **UI Components**: shadcn/ui

## Prerequisites

- Node.js 18.17 or later
- A modern web browser
- A Web3 wallet (MetaMask, Rainbow, etc.)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd base-erc20-poc
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up your environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration:

- `NEXT_PUBLIC_DISCRETE_ERC20_FACTORY_ADDRESS`: Address of the deployed ERC20 Factory contract
- `NEXT_PUBLIC_PAILLIER_ADDRESS`: Address of the deployed Paillier encryption contract

Paillier Encryption Keys:
- `NEXT_PUBLIC_PUBLIC_KEY_N`: The modulus n of the Paillier public key
- `NEXT_PUBLIC_PUBLIC_KEY_G`: The generator g of the Paillier public key
- `PAILLIER_LAMBDA`: The lambda value of the Paillier private key (keep this secret!)
- `PAILLIER_MU`: The mu value of the Paillier private key (keep this secret!)

Network:
- `ALCHEMY_API_KEY`: Your Alchemy API key for Base Sepolia network access

⚠️ **Security Note**: Never commit your `.env.local` file or share your private keys. The private key variables (`PAILLIER_LAMBDA` and `PAILLIER_MU`) should be kept secure and only used in a trusted environment.

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

1. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Connect Wallet**: Click the "Connect Wallet" button in the header to connect your Web3 wallet.
2. **Select/Deploy Token**: 
   - Use the default token, or
   - Deploy your own ERC20 token by providing token details
3. **View Balance**: Your encrypted token balance will be displayed and automatically updated
4. **Send Tokens**: Use the transfer form to send encrypted tokens to any address
5. **Track History**: View your transaction history in real-time

## Development

- `npm run build`: Create production build
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier
- `npm run test`: Run tests (if configured)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
