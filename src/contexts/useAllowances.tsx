import { createContext, useContext, useMemo, useState } from "react";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { erc20Abi, parseAbiItem } from "viem";
import { Allowances, TAddress } from "@/components/shared/types/types";
import { getPublicClient } from "@/config/getPublicClient";
import React from "react";
import { toast } from "react-toastify";

type TAllowancesLogProps = {
  updateAllowances: (contract: TAddress) => void;
  revokeAllowance: (contractAddress: TAddress, tokenAddress: TAddress) => void;
  allowances: Allowances | null;
};

const AllowancesContext = createContext<TAllowancesLogProps>({
  updateAllowances: async () => [],
  revokeAllowance: async () => {},
  allowances: null,
});

const parsedEventString = parseAbiItem(
  "event Approval(address indexed owner, address indexed sender, uint256 value)"
);

export const AllowancesProvider = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement => {
  const [allowances, setAllowances] = useState<Allowances | null>(null);

  const { address } = useAccount();

  const { writeContract } = useWriteContract();

  const chainId = useChainId();

  const publicClient = useMemo(() => getPublicClient(chainId), [chainId]);

  const onRevokeSuccess = () => {
    toast.success("Allowance succesfully revoked", {
      position: "bottom-center",
    });
  };

  const watchAllowances = (contract: TAddress) => {
    publicClient.watchEvent({
      address: contract,
      event: parsedEventString,
      args: {
        owner: address,
      },
      onLogs: (logs) => {
        setAllowances(logs as Allowances);
      },
    });
  };

  // Update allowances on button click
  const updateAllowances = async (contract: TAddress) => {
    try {
      const logEvents = await publicClient.getLogs({
        address: contract,
        event: parsedEventString,
        args: {
          owner: address,
        },
        fromBlock: BigInt(1),
      });

      setAllowances(logEvents as Allowances);
      watchAllowances(contract);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating allowances:", error);
        toast.error(`Error updating allowances: ${error?.message}"`);
      }
    }
  };

  const revokeAllowance = (contract: TAddress, tokenAddress: TAddress) => {
    writeContract(
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [contract, BigInt(0)],
      },
      { onSuccess: onRevokeSuccess }
    );
  };

  const contextValue = useMemo(
    (): TAllowancesLogProps => ({
      updateAllowances,
      allowances,
      revokeAllowance,
    }),
    [updateAllowances, allowances, revokeAllowance]
  );

  return (
    <AllowancesContext.Provider value={contextValue}>
      {children}
    </AllowancesContext.Provider>
  );
};

// Hook to consume context
export const useAllowances = () => {
  const {
    allowances,
    updateAllowances,
    revokeAllowance: revoke,
  } = useContext(AllowancesContext);
  return { allowances, updateAllowances, revoke };
};
