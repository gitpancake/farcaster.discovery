import { Address } from "viem";
import { Neynar } from "./base";

type User = {
  username: string;
  verified_addresses: {
    primary: {
      eth_address: Address;
    };
  };
};

export class NeynarUsers extends Neynar {
  constructor() {
    super();
  }

  public async getUsersByFids(fids: number[]): Promise<User[]> {
    // Neynar API expects fids as repeated query params: ?fids=1&fids=2
    const data = await this.instance.get("/farcaster/user/bulk", { params: { fids } });

    return data.data.users;
  }
}
