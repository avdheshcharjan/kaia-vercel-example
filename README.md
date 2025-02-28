This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) demoing Onchain Agents on Kaia using GOAT SDK + Vercel AI.

## Getting Started

1. Install Dependencies

```bash
pnpm install
```

2. Configure .env to look like this:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=
WALLET_PRIVATE_KEY=
RPC_PROVIDER_URL=
KAIASCAN_API_KEY=
```

3. Run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Prompts

1. Check Balance

```bash
Check KAIA balance and provide value in the chat.
Check ST balance and provide value in the chat.

Check KAIA balance for 0x2330384317C95372875AD81d5D6143E7735714A5 and provide value in the chat.
Check GOAT balance for 0x0348264cFF5faDefb0A03a5468fD5a9eB589b23b and provide value in the chat.
```

2. Send Tokens

```bash
Send 0.0001 KAIA to 0x2330384317C95372875AD81d5D6143E7735714A5 and provide hash for the transaction here.
Send 1 GOAT to 0x2330384317C95372875AD81d5D6143E7735714A5 and provide hash for the transaction here.
```

3. Kaiascan API Interactions

```bash
Get me the list of erc20 token balances for 0x0348264cFF5faDefb0A03a5468fD5a9eB589b23b
Get price of KAIA and provide value in the chat
```

## Learn More

To learn more about Onchain AI Agent, take a look at the following resources:

- [Vercel AI](https://sdk.vercel.ai/docs/getting-started/nextjs-app-router)
- [GOAT SDK](https://ohmygoat.dev/introduction) 


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
