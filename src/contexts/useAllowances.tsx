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

const AllowancesLogContext = createContext<TAllowancesLogProps>({
  updateAllowances: async () => [],
  revokeAllowance: async () => {},
  allowances: [],
});

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

  const onRevokeSuccess = (contract: TAddress) => {
    updateAllowances(contract);
    toast.success("Allowance succesfully revoked", {
      position: "bottom-center",
    });
  };

  const updateAllowances = (contract: TAddress) => {
    new Promise((res) =>
      res(
        publicClient.getLogs({
          address: contract,
          event: parseAbiItem(
            "event Approval(address indexed owner, address indexed sender, uint256 value)"
          ),
          args: {
            owner: address,
          },
          fromBlock: BigInt(1),
        })
      )
    ).then((res) => {
      setAllowances(res as Allowances);
      console.log(res);
    });
  };

  const revokeAllowance = (contract: TAddress, tokenAddress: TAddress) => {
    writeContract(
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [contract, BigInt(0)],
      },
      { onSuccess: () => onRevokeSuccess(contract) }
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
    <AllowancesLogContext.Provider value={contextValue}>
      {children}
    </AllowancesLogContext.Provider>
  );
};

export const useAllowances = () => {
  const {
    allowances,
    updateAllowances,
    revokeAllowance: revoke,
  } = useContext(AllowancesLogContext);
  return { allowances, updateAllowances, revoke };
};
