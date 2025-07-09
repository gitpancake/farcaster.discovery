import { base, baseSepolia } from "viem/chains";

export type NetworkConfig = {
  chain: typeof base | typeof baseSepolia;
  explorerUrl: string;
  name: string;
};

export function getNetworkConfig(): NetworkConfig {
  const env = process.env.NODE_ENV;
  if (env === "production" || env === "mainnet") {
    return {
      chain: base,
      explorerUrl: "https://basescan.org/tx/",
      name: "Base Mainnet",
    };
  } else {
    return {
      chain: baseSepolia,
      explorerUrl: "https://sepolia.basescan.org/tx/",
      name: "Base Sepolia Testnet",
    };
  }
}
