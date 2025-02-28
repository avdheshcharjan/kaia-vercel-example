import { Chain, PluginBase, createTool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import axios from "axios";
import 'dotenv/config';
import { z } from "zod";

export type KaiaScanConfig = {
    apiKey?: string;
};

export class KaiaScanApiPlugin extends PluginBase<EVMWalletClient> {
    private apiKey: string;

    constructor(config: KaiaScanConfig = {}) {
        super("kaiascan-api", []);
        this.apiKey = config.apiKey || process.env.KAIASCAN_API_KEY || "";
    }

    // For EVM-specific plugin, we check if the chain is EVM compatible
    supportsChain = (chain: Chain) => {
        return chain.type === "evm";
    }

    getTools(walletClient: EVMWalletClient) {
        return [
            createTool(
                {
                    name: "get_kaia_price",
                    description: "Get current KAIA price information",
                    parameters: z.object({}),
                },
                async () => {
                    try {
                        const response = await axios.request({
                            method: 'get',
                            url: 'https://mainnet-oapi.kaiascan.io/api/v1/kaia',
                            headers: { 
                                'Accept': '*/*', 
                                'Authorization': `Bearer ${this.apiKey}`
                            }
                        });
                        
                        return response.data.klay_price;
                    } catch (error) {
                        console.error("Error fetching KLAY price:", error);
                        throw new Error("Failed to fetch KLAY price information");
                    }
                }
            ),
            createTool(
                {
                    name: "get_network_summary",
                    description: "Get Kaia network summary information",
                    parameters: z.object({}),
                },
                async () => {
                    try {
                        const response = await axios.request({
                            method: 'get',
                            url: 'https://mainnet-oapi.kaiascan.io/api/v1/kaia',
                            headers: { 
                                'Accept': '*/*', 
                                'Authorization': `Bearer ${this.apiKey}`
                            }
                        });
                        
                        return response.data.summary;
                    } catch (error) {
                        console.error("Error fetching network summary:", error);
                        throw new Error("Failed to fetch Kaia network summary");
                    }
                }
            ),
            createTool(
                {
                    name: "get_erc20_token_balances",
                    description: "Get all ERC20 token balances for a given address",
                    parameters: z.object({
                        address: z.string().regex(/^0x[a-fA-F0-9]{40}$/).describe("The wallet address to check token balances for")
                    }),
                },
                async (parameters) => {
                    try {
                        const response = await axios.request({
                            method: 'get',
                            url: `https://mainnet-oapi.kaiascan.io/api/v1/accounts/${parameters.address}/token-balances`,
                            headers: { 
                                'Accept': '*/*', 
                                'Authorization': `Bearer ${this.apiKey}`
                            }
                        });
                        
                        return response.data;
                    } catch (error) {
                        console.error("Error fetching token balances:", error);
                        throw new Error("Failed to fetch token balances for the address");
                    }
                }
            )
        ];
    }
}

// Export a factory function to create a new instance of the plugin
export function kaiascanApi(config: KaiaScanConfig = {}) {
    return new KaiaScanApiPlugin(config);
}