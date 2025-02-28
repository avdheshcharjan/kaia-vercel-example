import { Chain, PluginBase, createTool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { Interface } from "@ethersproject/abi";
import { getAddress } from "@ethersproject/address";
import { parseEther } from "@ethersproject/units";
import { z } from "zod";

// ERC20 ABI for token approval
const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export type DGSwapV3Config = {
  routerAddress: string;
  wethAddress?: string;
  quoterAddress?: string;
  tokenMap?: Record<string, string>;
};

export class DGSwapV3ExactInputPlugin extends PluginBase<EVMWalletClient> {
  private routerAddress: string;
  private wethAddress: string;
  private quoterAddress: string;
  private erc20Interface: Interface;

  constructor(config: DGSwapV3Config) {
    super("pancakeswap-v3-exactinput", []);
    this.routerAddress = this.normalizeAddress(
      config.routerAddress || "0xa324880f884036e3d21a09b90269e1ac57c7ec8a" // V3 router address
    );
    this.wethAddress = this.normalizeAddress(
      config.wethAddress || "0x19aac5f612f524b754ca7e7c41cbfa2e981a4432" // Default WKLAY
    );
    this.quoterAddress = this.normalizeAddress(
      config.quoterAddress || "0x0000000000000000000000000000000000000000" // Default quoter
    );
    this.erc20Interface = new Interface(ERC20_ABI);
  }

  // Normalize address to prevent checksum errors
  private normalizeAddress(address: string): string {
    try {
      return getAddress(address.toLowerCase());
    } catch (e) {
      return address.toLowerCase();
    }
  }

  // Support EVM chains
  supportsChain = (chain: Chain) => {
    return chain.type === "evm";
  };

  // Encode path according to V3 format (addresses and fees interleaved)
  private encodePath(tokenIn: string, tokenOut: string, fee: number): Uint8Array {
    // For debugging
    console.log("Input to encodePath:");
    console.log("tokenIn:", tokenIn);
    console.log("tokenOut:", tokenOut);
    console.log("fee:", fee);
    
    // Remove 0x prefix from addresses
    const tokenInBytes = Buffer.from(tokenIn.slice(2).toLowerCase(), 'hex');
    const tokenOutBytes = Buffer.from(tokenOut.slice(2).toLowerCase(), 'hex');
    
    // Convert fee to buffer (3 bytes)
    const feeBytes = Buffer.alloc(3);
    feeBytes.writeUIntBE(fee, 0, 3);
    
    // Concatenate the bytes
    const path = Buffer.concat([tokenInBytes, feeBytes, tokenOutBytes]);
    
    console.log("Result of encodePath (hex):", path.toString('hex'));
    
    return new Uint8Array(path);
  }

  getTools(walletClient: EVMWalletClient) {
    return [
      createTool(
        {
          name: "swap_eth_for_tokens_exactinput",
          description: "Swap KAIA for USDT_WORMHOLE tokens using DGSwap V3 exactInput",
          parameters: z.object({
            amountIn: z
              .string()
              .default("0.001")
              .describe("Amount of KLAY to swap (e.g. 0.001)"),
            tokenOut: z
              .string()
              .default("0x5c13e303a62fc5dedf5b52d66873f2e59fedadc2")
              .describe("Address of token to receive"),
            fee: z
              .number()
              .default(500)
              .describe("Fee tier (500 = 0.05%, 3000 = 0.3%, 10000 = 1%)"),
            amountOutMin: z
              .string()
              .default("0")
              .describe("Minimum amount of tokens to receive (0 for no minimum)"),
          }),
        },
        async (parameters) => {
          try {
            // Check wallet balance
            const balanceHex = await walletClient.balanceOf(walletClient.getAddress());
            const balanceBigNumber = balanceHex.value;
            console.log(`Wallet balance: ${balanceBigNumber} KLAY`);

            // Parse the requested amount
            let amountToSwap = parameters.amountIn;
            
            // Convert to wei
            const amountInWei = parseEther(amountToSwap);
            console.log(
              `Swapping ${amountToSwap} KLAY (${amountInWei.toString()} wei)`
            );
            
            // Format token out address
            const tokenOut = this.normalizeAddress(parameters.tokenOut);
            const recipient = walletClient.getAddress();
            const deadline = Math.floor(Date.now() / 1000) + 1200; // 20 minutes
            
            // Define the V3 router interface based on the contract
            const pancakeV3RouterInterface = new Interface([
              "function exactInput(tuple(bytes path, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum)) external payable returns (uint256 amountOut)",
              "function multicall(uint256 deadline, bytes[] calldata data) external payable returns (bytes[] memory results)",
              "function refundETH() external payable"
            ]);
            
            // Get the properly encoded path as bytes
            const encodedPath = this.encodePath(
              this.wethAddress,
              tokenOut,
              parameters.fee
            );
            
            console.log("Router address:", this.routerAddress);
            console.log("WETH address:", this.wethAddress);
            console.log("Token out address:", tokenOut);
            console.log("Fee tier:", parameters.fee);
            
            // Define params for exactInput
            const exactInputParams = {
              path: encodedPath,
              recipient: recipient,
              deadline: deadline,
              amountIn: amountInWei.toString(),
              amountOutMinimum: parameters.amountOutMin ? parseEther(parameters.amountOutMin).toString() : "0"
            };
            
            console.log("ExactInput params:", JSON.stringify(exactInputParams, (key, value) => {
              if (key === 'path' && value instanceof Uint8Array) {
                return '0x' + Buffer.from(value).toString('hex');
              }
              return value;
            }, 2));
            
            // Encode the exactInput call
            const swapCalldata = pancakeV3RouterInterface.encodeFunctionData(
              'exactInput',
              [exactInputParams]
            );
            
            // Encode the refundETH call
            const refundETHCalldata = pancakeV3RouterInterface.encodeFunctionData('refundETH', []);
            
            // Wrap both calls into multicall
            const calldata = pancakeV3RouterInterface.encodeFunctionData('multicall', [
              deadline,
              [swapCalldata, refundETHCalldata]
            ]);
            
            console.log("Generated calldata:", calldata);
            console.log("Sending transaction with value:", amountInWei.toString());

            // Send transaction with the adjusted amount
            const tx = await walletClient.sendTransaction({
              to: this.routerAddress as `0x${string}`,
              data: calldata as `0x${string}`,
              value: BigInt(amountInWei.toString()),
            });

            return {
              success: true,
              txHash: tx.hash,
              details: {
                amountIn: amountToSwap,
                tokenOut,
                router: this.routerAddress
              }
            };
            
          } catch (error) {
            console.error("Error executing KLAY swap:", error);

            // Extract more useful error information
            let errorMsg = "Failed to swap KLAY for tokens.";
            if (error.message?.includes("insufficient funds")) {
              errorMsg = "Insufficient KLAY in your wallet for this swap.";
            } else if (error.message?.includes("pool not initialized")) {
              errorMsg = "Pool not initialized for this token pair and fee tier. Try a different fee tier or token.";
            }

            return {
              success: false,
              error: errorMsg,
              details: {
                originalError: error.message,
                routerAddress: this.routerAddress,
                wethAddress: this.wethAddress,
                tokenOutAddress: parameters.tokenOut,
              },
            };
          }
        }
      ),
    ];
  }
}

// Export a factory function to create a new instance of the plugin
export function dgSwapV3ExactInput(config: DGSwapV3Config) {
  return new DGSwapV3ExactInputPlugin(config);
}