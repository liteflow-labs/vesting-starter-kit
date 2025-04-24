# Vesting Starter Kit

## Purpose

The Vesting Starter Kit is a boilerplate project designed to help businesses launch their own vesting contracts. It includes a Next.js frontend with TypeScript, Tailwind CSS, and React Query, as well as a Liteflow SDK backend to manage vesting contracts.

## Features

- **Feature 1:** Display a list of vesting contracts for users to interact with.
- **Feature 2:** Claim vested tokens for users.
- **Feature 3:** View vesting history for users.

## Setup

Follow these steps to set up the project:

### Clone the repository:

```bash
git clone https://github.com/liteflow-labs/vesting-starter-kit.git
cd vesting-starter-kit
```

### Install dependencies:

```bash
npm install
```

### Run the development server:

```bash
npm run dev
```

### Build the application:

```bash
npm run build
```

### Start the production server:

```bash
npm start
```

## Configuration

The project uses environment variables to configure the frontend and backend. Create a `.env.local` file in the root of the project and add the following variables:

```bash
# Create your project ID on https://reown.com/
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=

# Create your Liteflow API key on https://dashboard.liteflow.com/developers
NEXT_PUBLIC_LITEFLOW_API_KEY=

# Chain ID
NEXT_PUBLIC_CHAIN_ID=1

# Token address
NEXT_PUBLIC_TOKEN_ADDRESS=0x...

# Optional provider URL
NEXT_PUBLIC_ETHEREUM_MAINNET_PROVIDER_URL=
NEXT_PUBLIC_ETHEREUM_SEPOLIA_PROVIDER_URL=
NEXT_PUBLIC_BSC_MAINNET_PROVIDER_URL=
NEXT_PUBLIC_BSC_TESTNET_PROVIDER_URL=
NEXT_PUBLIC_POLYGON_MAINNET_PROVIDER_URL=
NEXT_PUBLIC_POLYGON_AMOY_PROVIDER_URL=
NEXT_PUBLIC_BASE_MAINNET_PROVIDER_URL=
NEXT_PUBLIC_BASE_SEPOLIA_PROVIDER_URL=
NEXT_PUBLIC_NEONEVM_MAINNET_PROVIDER_URL=
NEXT_PUBLIC_NEONEVM_DEVNET_PROVIDER_URL=
NEXT_PUBLIC_LIGHTLINK_PEGASUS_PROVIDER_URL=
NEXT_PUBLIC_LIGHTLINK_PHOENIX_PROVIDER_URL=
NEXT_PUBLIC_ARBITRUM_ONE_PROVIDER_URL=
NEXT_PUBLIC_ARBITRUM_SEPOLIA_PROVIDER_URL=
```

The UI is built with [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/), so you can customize the styles by editing the `tailwind.config.js` file and by importing components from the `shadcn/ui` library.

The application uses [Wagmi](https://wagmi.sh/) and [RainbowKit](https://www.rainbowkit.com/) for wallet connection.

## Deployment

The project is designed to be deployed to Vercel. You can deploy the project by connecting your GitHub repository to Vercel and configuring the environment variables in the Vercel dashboard.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/liteflow-labs/{REPO})

## Build and publish Docker image

Make sure to have the envs in the file `.env.production`.

```bash
docker build -t IMAGE_TAG --platform linux/amd64 --push .
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.
