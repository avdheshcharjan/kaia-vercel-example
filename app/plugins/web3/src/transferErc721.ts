import { isKlaytnAccountKeyType, TxType } from "@kaiachain/ethers-ext";
import { AbiFactory, TokenTransferPayload } from "../utils/token";
import { getAccount } from "../utils/helper";

export const transferErc721 = async (
  parameters: Omit<TokenTransferPayload, "type" | "amount">,
  config: any,
  walletClient: any
) => {
  try {
    const sender =
    walletClient.address ||
    walletClient.account?.address ||
    walletClient.getAddress();
    const accountType: { accType: number } = await await getAccount(
      walletClient,
      sender
    );
    parameters.sender = sender;
    const res: any = {
      from: sender,
      to: parameters.contractAddress,
      data: new AbiFactory({
        ...(parameters as Partial<TokenTransferPayload>),
        type: "erc721",
      }).createParams(),
      type: undefined,
    };
    if (
      walletClient.provider?.kaia && isKlaytnAccountKeyType(accountType.accType)
    ) {
      res.type = TxType.SmartContractExecution;
    }

    const sentTx = await walletClient.sendTransaction(res);
    return {
      transactionHash: sentTx.hash || sentTx,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
