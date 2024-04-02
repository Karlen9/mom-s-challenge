import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  useAccount,
  useChainId,
  useReadContracts,
  useWriteContract,
} from "wagmi";
import { erc20Abi, parseAbiItem } from "viem";
import { Allowances, TAddress } from "@/components/shared/types/types";
import { getPublicClient } from "@/config/getPublicClient";
import React from "react";
import { toast } from "react-toastify";
import { filterMaxValueByAddress } from "../components/shared/utils/filterMaxValueByAddress";

type TAllowancesLogProps = {
  updateAllowances: (contract: TAddress) => void;
  revokeAllowance: (contractAddress: TAddress, tokenAddress: TAddress) => void;
  allowances: Allowances | null | undefined;
  isLoading: boolean;
};

const AllowancesContext = createContext<TAllowancesLogProps>({
  updateAllowances: async () => [],
  revokeAllowance: () => {},
  isLoading: false,
  allowances: null,
});

const parsedApprovalEvent = parseAbiItem(
  "event Approval(address indexed owner, address indexed sender, uint256 value)"
);

export const AllowancesProvider = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement => {
  const [rawAllowances, setRawAllowances] = useState<Allowances | null>(null);

  const { address } = useAccount();

  const { writeContract } = useWriteContract();

  const chainId = useChainId();

  const publicClient = useMemo(() => getPublicClient(chainId), [chainId]);

  //getting all allowances for the events we have from logs
  const {
    data: result,
    refetch,
    isLoading,
  } = useReadContracts({
    contracts: rawAllowances?.map((item) => {
      return {
        address: item.address,
        abi: erc20Abi,
        functionName: "allowance",
        args: [item.args.owner, item.args.sender],
      };
    }),
  });

  // Update allowances on button click
  const updateAllowances = useCallback(
    async (contract: TAddress) => {
      try {
        const approvalEvents = await publicClient.getLogs({
          address: contract,
          event: parsedApprovalEvent,
          args: {
            owner: address,
          },
          fromBlock: BigInt(1),
        });

        refetch();
        const filteredEvents = filterMaxValueByAddress(
          approvalEvents as Allowances
        );
        setRawAllowances(filteredEvents);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error updating allowances:", error);
        }
      }
    },
    [address, publicClient]
  );

  //update logs according to allowances' values
  const allowances: Allowances | undefined | null = useMemo(() => {
    if (!rawAllowances) return [];
    if (!result) return rawAllowances;
    return rawAllowances.map((item, index) => {
      return {
        ...item,
        args: {
          ...item.args,
          value: result[index].result as bigint,
        },
      };
    });
  }, [rawAllowances, result, updateAllowances]);

  const onRevokeSuccess = useCallback(
    (tokenAddress: TAddress) => {
      updateAllowances(tokenAddress);
      toast.success("Allowance succesfully revoked", {
        position: "bottom-center",
      });
    },
    [updateAllowances]
  );

  const revokeAllowance = useCallback(
    (contract: TAddress, tokenAddress: TAddress) => {
      writeContract(
        {
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [contract, BigInt(0)],
        },
        { onSuccess: () => onRevokeSuccess(tokenAddress) }
      );
    },
    [onRevokeSuccess, writeContract]
  );

  const contextValue = useMemo(
    (): TAllowancesLogProps => ({
      updateAllowances,
      allowances,
      isLoading,
      revokeAllowance,
    }),
    [updateAllowances, allowances, revokeAllowance, isLoading]
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
    isLoading,
    revokeAllowance: revoke,
  } = useContext(AllowancesContext);
  return { allowances, updateAllowances, revoke, isLoading };
};
