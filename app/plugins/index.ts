import * as Web3 from './web3';
import * as KaiaScan from './kaiascan';

export enum PackagesEnum {
  WEB3 = 'web3',
  KAIASCAN = 'kaiascan'
}

export const Packages = {
  [PackagesEnum.WEB3]: Web3,
  [PackagesEnum.KAIASCAN]: KaiaScan
};

export { Kaia, KaiaPlugin } from "./kaia.plugin";

