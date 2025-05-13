
import * as Web3 from './web3';

export enum PackagesEnum {
  WEB3 = 'web3',
}

export const Packages = {
  [PackagesEnum.WEB3]: Web3
};

export { Kaia, KaiaPlugin } from "./kaia.plugin";

