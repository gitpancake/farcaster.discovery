import { createMetadataBuilder, createZoraUploaderForCreator } from "@zoralabs/coins-sdk";
import { Address } from "viem";

type MetadataProps = {
  name: string;
  symbol: string;
  description: string;
  image: File;
};

class MetadataUpload {
  constructor(private readonly creatorAddress: Address) {
    this.creatorAddress = creatorAddress;
  }

  async uploadMetadata({ name, symbol, description, image }: MetadataProps) {
    return await createMetadataBuilder()
      .withName(name)
      .withSymbol(symbol)
      .withDescription(description)
      .withImage(image)
      .validate()
      .upload(createZoraUploaderForCreator(this.creatorAddress as Address));
  }
}

export default MetadataUpload;
