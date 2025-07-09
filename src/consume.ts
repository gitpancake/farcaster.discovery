import { ConsumeMessage } from "amqplib";
import { config } from "dotenv";
import { NeynarUsers } from "./neynar/users";
import { RabbitMQBaseConsumer } from "./rabbitmq";
import { removeSpaces, replaceSpacesWithCommas } from "./util/strings";
import { CoinDeployer } from "./zora/CoinDeployer";

config();

// Types

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

class FlashConsumer extends RabbitMQBaseConsumer {
  coinDeployer: CoinDeployer;
  constructor() {
    super();
    this.coinDeployer = new CoinDeployer();
  }

  async handleMessage(msg: ConsumeMessage) {
    const message: Message = JSON.parse(msg.content.toString());

    // resolve fid to get connected address (neynar)
    const [user] = await new NeynarUsers().getUsersByFids([message.fid]);
    const payoutRecipient = user.verified_addresses.primary.eth_address;

    const image = await fetch(message.flash.img);
    const imageData = await image.arrayBuffer();
    const imageFile = new File([imageData], `flash_${message.flash.flash_id}.jpg`, { type: image.headers.get("content-type") ?? "image/jpg" });

    const name = `#${replaceSpacesWithCommas(message.flash.flash_count)} | ${message.flash.city}`;
    const symbol = removeSpaces(message.flash.flash_count);
    const description = `Captured in the wild: a street mosaic by Invader, the French artist who’s been installing pixel art across cities worldwide. Flashed at ${message.flash.timestamp} in ${message.flash.city} by ${user.username}.`;

    await this.coinDeployer.deployCoin({
      name,
      symbol,
      description,
      image: imageFile,
      payoutRecipient,
    });
  }
}

export default FlashConsumer;
