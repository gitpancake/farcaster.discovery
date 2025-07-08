import { setApiKey } from "@zoralabs/coins-sdk";
import { config } from "dotenv";
import FlashConsumer from "./consume";

config();

// Set up your API key before making any SDK requests
setApiKey(process.env.ZORA_API_KEY);

const message = JSON.stringify({
  fid: 732,
  flash: {
    flash_id: 81877953,
    city: "San Diego",
    player: "WORLDY",
    img: "https://invader-flashes.s3.us-east-2.amazonaws.com/media/queries/2025/03/27/image_A2tHBOe.jpg",
    text: "San Diego, WORLDY",
    timestamp: "2025-03-26 16:06:43.918",
    flash_count: "32 750 197",
  },
});

const main = async () => {
  const flashConsumer = new FlashConsumer();
  await flashConsumer.handleMessage({
    content: Buffer.from(message),
    fields: {
      consumerTag: "",
      deliveryTag: 0,
      redelivered: false,
      exchange: "",
      routingKey: "",
    },
    properties: {
      contentEncoding: "utf-8",
      contentType: "application/json",
      deliveryMode: 2,
      headers: {},
      priority: 0,
      appId: "farcaster.discovery",
      clusterId: "farcaster.discovery",
      messageId: "123",
      timestamp: Date.now(),
      type: "farcaster.discovery",
      userId: "123",
      replyTo: "",
      correlationId: "", // or null
      expiration: "", // or null
    },
  });
};

// main();
