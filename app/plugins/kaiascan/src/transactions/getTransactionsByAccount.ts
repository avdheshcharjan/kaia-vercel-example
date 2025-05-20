import { API_DEFAULTS } from "../../utils/constants";
import validations from "../../utils/validations";
import * as dotenv from 'dotenv';
dotenv.config();

export const getTransactionsByAccount = async (
  parameters: any,
  config: any
) => {
  try {
    let KAIA_KAIASCAN_API_KEY = process.env.KAIA_KAIASCAN_API_KEY;
    let { address, network } = parameters;
    network = network ? network.toLowerCase() : "kairos";

    validations.checkApiKey(KAIA_KAIASCAN_API_KEY);
    validations.checkAddress(address);
    validations.checkNetwork(network);

    const url = `${API_DEFAULTS.BASE_URL[network]}/accounts/${address}/transactions`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${KAIA_KAIASCAN_API_KEY}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.message || response.statusText);
    }

    const data = await response.json();
    
    // Limit to first 5 transactions
    const transactions = data.results?.slice(0, 5).map((transaction: any, index: number) => ({
      index: index + 1,
      from: transaction.from_account?.address || "unknown",
      to: transaction.to_account?.address || "contract creation",
      amount: transaction.value,
      transaction_type: transaction.type === 2 ? "Ethereum Dynamic Fee" : "Legacy",
      transaction_hash: transaction.transaction_hash
    })) || [];

    // Create formatted text output
    let formattedText = `The transactions for\n${address} account\non ${network} are:\n`;
    
    if (transactions.length > 0) {
      transactions.forEach((tx: any) => {
        formattedText += `${tx.index}. From: ${tx.from}\nTo: ${tx.to}\nValue: ${tx.amount}\nType: ${tx.transaction_type}\nHash:\n${tx.transaction_hash}\n`;
      });
    } else {
      formattedText = `No transactions found for ${address} on ${network}`;
    }

    return {
      address,
      network,
      has_transactions: transactions.length > 0,
      transactions,
      formatted_text: formattedText
    };
  } catch (error: any) {
    console.error("Error in getTransactionsByAccount:", error);
    return {
      error: true,
      message: error.message || "Failed to fetch transactions",
      network: parameters.network || "kairos",
      address: parameters.address,
      has_transactions: false,
      transactions: [],
      formatted_text: `No transactions found for ${parameters.address} on ${parameters.network || "kairos"}`
    };
  }
};
