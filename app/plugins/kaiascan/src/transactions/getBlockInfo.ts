import { API_DEFAULTS } from "../../utils/constants";
import validations from "../../utils/validations";

export const getBlockInfo = async (parameters: any, config: any) => {
  let KAIA_KAIASCAN_API_KEY = config.KAIA_KAIASCAN_API_KEY;
  let { blockNumber, network } = parameters;
  network = network ? network.toLowerCase() : "kairos";

  validations.checkApiKey(KAIA_KAIASCAN_API_KEY);
  validations.checkNetwork(network);

  const url = `${API_DEFAULTS.BASE_URL[network]}/blocks/${blockNumber}`;
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
    block_number: data.block_id,
    block_time: data.datetime,
    block_hash: data.hash,
    total_transaction_count: data.total_transaction_count
  };
};
