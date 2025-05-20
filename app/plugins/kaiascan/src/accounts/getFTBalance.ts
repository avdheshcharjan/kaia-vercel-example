import { API_DEFAULTS } from "../../utils/constants";
import validations from "../../utils/validations";

export const getFTBalance = async (parameters: any, config: any) => {
  let KAIA_KAIASCAN_API_KEY = config.KAIA_KAIASCAN_API_KEY;
  let { address, network } = parameters;
  network = network ? network.toLowerCase() : "kairos";

  validations.checkApiKey(KAIA_KAIASCAN_API_KEY);
  validations.checkAddress(address);
  validations.checkNetwork(network);

  const url = `${API_DEFAULTS.BASE_URL[network]}/${address}/token-details`;
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
    address: address,
    network: network,
    total_count: data.paging.total_count,
    tokens: data.results.map((item: any) => ({
      contract_address: item.contract.contract_address,
      symbol: item.contract.symbol,
      name: item.contract.name,
      total_supply: item.contract.total_supply,
      balance: item.balance
    }))
  };
};
