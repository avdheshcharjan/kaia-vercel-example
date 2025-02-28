import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

import { http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { kairos, kaia } from "viem/chains";

import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { Token, erc20 } from "@goat-sdk/plugin-erc20";

import { sendETH } from "@goat-sdk/wallet-evm";
import { viem } from "@goat-sdk/wallet-viem";

import { kaiascanApi } from '../../plugins/kaiascan-api/index';
import { dgSwapV3ExactInput } from '../../plugins/dgswap/index';

require("dotenv").config();

// @ts-ignore
const GOAT: Token = {
    chains: {
        "8217": {
            contractAddress: "0x1D0b45f1B88f5470428440859Dbe4d6667E27512", // 0x56dD1467090818E0Fc271C1c7C76a8F8bD64297e ST
        },
    },
    name: "GOAT MAXIMEUS",
    symbol: "GOAT",
};

const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
    account: account,
    transport: http(process.env.RPC_PROVIDER_URL),
    chain: kaia,
});

const tools = await getOnChainTools({
    wallet: viem(walletClient),
    plugins: [sendETH(), erc20({ tokens: [GOAT] }), kaiascanApi({apiKey: process.env.KAIASCAN_API_KEY}), dgSwapV3ExactInput({routerAddress: "0xa324880f884036e3d21a09b90269e1ac57c7ec8a", wethAddress: "0x19aac5f612f524b754ca7e7c41cbfa2e981a4432"})],
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {

  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-1.5-pro-latest'),
    tools: tools,
    messages,
    maxSteps: 10,
  });

  return result.toDataStreamResponse();
}