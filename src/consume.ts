import { CreateCoinArgs, CreateMetadataParameters, DeployCurrency, createCoin } from "@zoralabs/coins-sdk";
import { ConsumeMessage } from "amqplib";
import { config } from "dotenv";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { NeynarUsers } from "./neynar/users";
import { RabbitMQBaseConsumer } from "./rabbitmq";
import { removeSpaces, replaceSpacesWithCommas } from "./util/strings";
import MetadataUpload from "./zora/metadataUpload";

config();

type Flash = {
  img: string;
  city: string;
  text: string;
  player: string;
  flash_id: number;
  timestamp: number;
  flash_count: string;
};

type Message = {
  fid: number;
  flash: Flash;
};

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const account = privateKeyToAccount(process.env.PRIVATE_KEY! as `0x${string}`);

console.log({ account });

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});

class FlashConsumer extends RabbitMQBaseConsumer {
  constructor() {
    super();
  }

  async handleMessage(msg: ConsumeMessage) {
    const message: Message = JSON.parse(msg.content.toString());

    // resolve fid to get connected address (neynar ?)
    const [user] = await new NeynarUsers().getUsersByFids([message.fid]);

    const payoutRecipient = user.verified_addresses.primary.eth_address;

    const image = await fetch(message.flash.img);
    const imageData = await image.arrayBuffer();
    const imageFile = new File([imageData], `flash_${message.flash.flash_id}.jpg`, { type: image.headers.get("content-type") ?? "image/jpg" });

    let metadata: CreateMetadataParameters | null = null;

    try {
      const { createMetadataParameters } = await new MetadataUpload(payoutRecipient).uploadMetadata({
        name: `#${replaceSpacesWithCommas(message.flash.flash_count)} | ${message.flash.city}`,
        symbol: removeSpaces(message.flash.flash_count),
        description: `Captured in the wild: a street mosaic by Invader, the French artist who’s been installing pixel art across cities worldwide. Flashed at ${message.flash.timestamp} in ${message.flash.city} by ${user.username}.`,
        image: imageFile,
      });

      metadata = createMetadataParameters;
    } catch (error) {
      console.error(error);
    }

    if (!metadata) {
      throw new Error("Metadata not created");
    }

    const args: CreateCoinArgs = {
      ...metadata,
      chainId: baseSepolia.id,
      payoutRecipient,
      currency: DeployCurrency.ETH,
    };

    const coin = await createCoin(args, walletClient, publicClient, { gasMultiplier: 120 });

    console.log({ coin });
  }
}

export default FlashConsumer;
