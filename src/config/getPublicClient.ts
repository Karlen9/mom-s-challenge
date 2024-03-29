import { createPublicClient, http } from "viem"
import { config } from "./config"

export const getPublicClient = (chainId?: number) => {
  return createPublicClient({
    chain: config.chains[chainId || 1],
    transport: http(process.env.JSON_RPC_URL?.[chainId || 1]) 
  }) 
}