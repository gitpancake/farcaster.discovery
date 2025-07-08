import { ConsumeMessage } from "amqplib";
import { NeynarUsers } from "./neynar/users";
import { RabbitMQBaseConsumer } from "./rabbitmq";
import { removeSpaces, replaceSpacesWithCommas } from "./util/strings";
import MetadataUpload from "./zora/metadataUpload";

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
  constructor() {
    super();
  }

  async handleMessage(msg: ConsumeMessage) {
    const message: Message = JSON.parse(msg.content.toString());

    // resolve fid to get connected address (neynar ?)
    const [user] = await new NeynarUsers().getUsersByFids([message.fid]);

    const connectedAddress = user.verified_addresses.primary.eth_address;

    console.log({ connectedAddress });

    const image = await fetch(message.flash.img);
    const imageData = await image.arrayBuffer();
    const imageFile = new File([imageData], `flash_${message.flash.flash_id}.jpg`, { type: image.headers.get("content-type") ?? "image/jpg" });

    try {
      const { createMetadataParameters } = await new MetadataUpload(connectedAddress).uploadMetadata({
        name: `#${replaceSpacesWithCommas(message.flash.flash_count)} | ${message.flash.city}`,
        symbol: removeSpaces(message.flash.flash_count),
        description: `Captured in the wild: a street mosaic by Invader, the French artist who’s been installing pixel art across cities worldwide. Flashed at ${message.flash.timestamp} in ${message.flash.city} by ${user.username}.`,
        image: imageFile,
      });

      console.log({ createMetadataParameters });
    } catch (error) {
      console.error(error);
    }

    // create metadata based on flash URL

    // upload metadata to zora

    // create coin on zora

    // mint coin to fid

    // send flash to fid
  }
}

export default FlashConsumer;
