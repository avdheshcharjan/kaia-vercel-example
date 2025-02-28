import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

const hexAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/);

export class SwapExactInputParameters extends createToolParameters(
    z.object({
        tokenIn: hexAddress.describe("The address of the input token"),
        tokenOut: hexAddress.describe("The address of the output token"),
        tokenInDecimals: z.number().describe("The number of decimals for the input token"),
        tokenOutDecimals: z.number().describe("The number of decimals for the output token"),
        amountIn: z.string().describe("The exact amount of input tokens to swap (in wei)"),
        slippageTolerance: z.string().default("0.5").describe("Maximum slippage allowed (in percentage)"),
        fee: z.number().default(3000).describe("The pool fee in hundredths of a bip (e.g., 3000 for 0.3%)"),
        deadline: z.number().optional().describe("Transaction deadline (in seconds from now)"),
        recipient: z.string().optional().describe("The account that should receive the output (defaults to sender)"),
        sqrtPriceLimitX96: z.string().optional().describe("The price limit for the trade (optional)")
    }),
) {}

export class SwapExactOutputParameters extends createToolParameters(
    z.object({
        tokenIn: hexAddress.describe("The address of the input token"),
        tokenOut: hexAddress.describe("The address of the output token"),
        tokenInDecimals: z.number().describe("The number of decimals for the input token"),
        tokenOutDecimals: z.number().describe("The number of decimals for the output token"),
        amountOut: z.string().describe("The exact amount of output tokens to receive (in wei)"),
        slippageTolerance: z.string().default("0.5").describe("Maximum slippage allowed (in percentage)"),
        fee: z.number().default(3000).describe("The pool fee in hundredths of a bip (e.g., 3000 for 0.3%)"),
        deadline: z.number().optional().describe("Transaction deadline (in seconds from now)"),
        recipient: z.string().optional().describe("The account that should receive the output (defaults to sender)"),
        sqrtPriceLimitX96: z.string().optional().describe("The price limit for the trade (optional)")
    }),
) {}