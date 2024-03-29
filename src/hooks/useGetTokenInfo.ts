import { TAddress } from "@/components/shared/types/types";
import { erc20Abi } from "viem";
import { useReadContracts } from "wagmi";

export const useGetTokenInfo = (tokenAddress?: TAddress) => {
  const { data: tokenInfo, isLoading } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: tokenAddress,
        abi: erc20Abi, 
        functionName: "symbol",
      },
    ],
  });

  return {
    tokenName: tokenInfo?.[0],
    tokenDecimals: tokenInfo?.[1],
    tokenSymbol: tokenInfo?.[2],
    loading: isLoading,
  };
};
