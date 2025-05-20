import { API_DEFAULTS } from "../../utils/constants";
import validations from "../../utils/validations";

export const getAccountOverview = async (parameters: any, config: any) => {
  try {
    let KAIA_KAIASCAN_API_KEY = config.KAIA_KAIASCAN_API_KEY;
    let { address, network } = parameters;
    network = network ? network.toLowerCase() : "kairos";

    validations.checkApiKey(KAIA_KAIASCAN_API_KEY);
    validations.checkAddress(address);
    validations.checkNetwork(network);

    const url = `${API_DEFAULTS.BASE_URL[network]}/${address}`;
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
    
    return {
      address: data.address,
      account_type: data.account_type,
      balance: data.balance,
      total_transaction_count: data.total_transaction_count,
    };
  } catch (error: any) {
    console.error("Error in getAccountOverview:", error);
    return {
      error: true,
      message: error.message || "Failed to fetch account overview",
      address: parameters.address,
      network: parameters.network || "kairos"
    };
  }
};
