import { API_DEFAULTS } from "../../utils/constants";
import validations from "../../utils/validations";

export const getTransactionsByBlockNumber = async (
  parameters: any,
  config: any
) => {
  let KAIA_KAIASCAN_API_KEY = config.KAIA_KAIASCAN_API_KEY;
  let { blockNumber, network } = parameters;
  network = network ? network.toLowerCase() : "kairos";

  validations.checkApiKey(KAIA_KAIASCAN_API_KEY);
  if (typeof blockNumber !== "number") {
    throw new Error("Block number must be a number");
  }
  validations.checkNetwork(network);

  const url = `${API_DEFAULTS.BASE_URL[network]}/blocks/${blockNumber}/txs?limit=10`;
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
    network: network,
    block_number: blockNumber,
    total_count: data.paging.total_count,
    transactions: data.results.map((transaction: any) => ({
      transaction_hash: transaction.transaction_hash,
      from_address: transaction.from_account.address,
      to_address: transaction.to_account?.address || "contract creation",
      value: transaction.value,
      status: transaction.status_result.is_success ? "Success" : "Fail"
    }))
  };
};
