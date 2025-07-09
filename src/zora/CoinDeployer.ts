import { CreateCoinArgs, CreateMetadataParameters, DeployCurrency, createCoin } from "@zoralabs/coins-sdk";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Logger } from "../util/logger";
import { getNetworkConfig } from "../util/network";
import MetadataUpload from "./metadataUpload";

export class CoinDeployer {
  publicClient;
  walletClient;
  chain;
  explorerUrl;

  constructor() {
    const { chain, explorerUrl } = getNetworkConfig();
    this.chain = chain;
    this.explorerUrl = explorerUrl;
    this.publicClient = createPublicClient({ chain, transport: http() });
    const account = privateKeyToAccount(process.env.PRIVATE_KEY! as `0x${string}`);
    this.walletClient = createWalletClient({ account, chain, transport: http() });
    Logger.info("Loaded account", { address: account.address });
  }

  async deployCoin({ name, symbol, description, image, payoutRecipient }: { name: string; symbol: string; description: string; image: File; payoutRecipient: string }) {
    let metadata: CreateMetadataParameters | null = null;
    try {
      const { createMetadataParameters } = await new MetadataUpload(payoutRecipient as `0x${string}`).uploadMetadata({
        name,
        symbol,
        description,
        image,
      });

      metadata = createMetadataParameters;
    } catch (error) {
      Logger.error("Metadata upload failed", error);
      throw new Error("Metadata not created");
    }

    const args: CreateCoinArgs = {
      ...metadata,
      chainId: this.chain.id,
      payoutRecipient: payoutRecipient as `0x${string}`,
      currency: DeployCurrency.ETH,
    };

    const coin = await createCoin(args, this.walletClient, this.publicClient, { gasMultiplier: 120 });
    // Only log relevant info
    const txHash = coin.hash;
    const contractAddress = coin.address;
    const status = coin.receipt?.status;

    Logger.info("Coin deployed", {
      contractAddress,
      txHash,
      explorerUrl: `${this.explorerUrl}${txHash}`,
      status,
    });

    return { contractAddress, txHash, explorerUrl: `${this.explorerUrl}${txHash}`, status };
  }
}
