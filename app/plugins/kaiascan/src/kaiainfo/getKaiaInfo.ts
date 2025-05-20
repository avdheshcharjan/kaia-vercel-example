import { API_DEFAULTS } from "../../utils/constants";
import validations from "../../utils/validations";

export const getKaiaInfo = async (parameters: any, config: any) => {
  let KAIA_KAIASCAN_API_KEY = process.env.KAIA_KAIASCAN_API_KEY;

  validations.checkApiKey(KAIA_KAIASCAN_API_KEY);

  const url = `${API_DEFAULTS.BASE_URL["kaia"]}/kaia`;
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
    klay_price: {
      usd_price: data.klay_price.usd_price,
      btc_price: data.klay_price.btc_price,
      usd_price_changes: data.klay_price.usd_price_changes,
      market_cap: data.klay_price.market_cap,
      total_supply: data.klay_price.total_supply,
      volume: data.klay_price.volume
    }
  };
};

