import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAccount, useReadContracts, useWriteContract } from "wagmi";
import { erc20Abi, parseAbiItem } from "viem";
import { TAddress, TAllowances } from "@/components/shared/types/types";
import { getPublicClient } from "@/config/getPublicClient";
import { toast } from "react-toastify";
import { getLatestNotEmptyEvents } from "../components/shared/utils/getLatestNotEmptyEvents";
import { filterNotEmptyEvents } from "@/components/shared/utils/filterNotEmptyEvents";

type TAllowancesLogProps = {
  refreshAllowances: (contract: TAddress) => void;
  revokeAllowance: (contractAddress: TAddress, tokenAddress: TAddress) => void;
  allowances: TAllowances | null | undefined;
  isLoading: boolean;
};

const AllowancesContext = createContext<TAllowancesLogProps>({
  refreshAllowances: async () => [],
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
  const [approvalEvents, setApprovalEvents] = useState<TAllowances | null>(
    null
  );

  const { address, chainId } = useAccount();

  const { writeContract } = useWriteContract();

  const publicClient = useMemo(() => getPublicClient(chainId), [chainId]);

  useEffect(() => {
    setApprovalEvents(null);
  }, [address, chainId]);

  // Getting all allowances for the events we get from logs
  const {
    data: allowancesData,
    refetch,
    isLoading,
  } = useReadContracts({
    contracts: approvalEvents?.map((item) => {
      return {
        address: item.address,
        abi: erc20Abi,
        functionName: "allowance",
        args: [item.args.owner, item.args.sender],
      };
    }),
  });

  // Getting new approval event logs from blockchain
  const refreshAllowances = useCallback(
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

        const filteredEvents = getLatestNotEmptyEvents(
          approvalEvents as TAllowances
        );

        setApprovalEvents(filteredEvents);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error refreshing allowances:", error);
        }
      }
    },
    [address, publicClient]
  );

  // Update logs according to allowances' values
  const allowances: TAllowances | undefined | null = useMemo(() => {
    if (!approvalEvents) return null;
    if (!allowancesData) return approvalEvents;
    return filterNotEmptyEvents(
      approvalEvents.map((item, index) => {
        return {
          ...item,
          args: {
            ...item.args,
            value: allowancesData[index].result as bigint,
          },
        };
      })
    );
  }, [approvalEvents, allowancesData, refreshAllowances, address, chainId]);

  const onRevokeSuccess = useCallback(
    (tokenAddress: TAddress) => {
      refreshAllowances(tokenAddress);
      toast.success("Allowance succesfully revoked", {
        position: "bottom-center",
      });
    },
    [refreshAllowances]
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
      refreshAllowances,
      allowances,
      isLoading,
      revokeAllowance,
    }),
    [refreshAllowances, allowances, revokeAllowance, isLoading]
  );

  return (
    <AllowancesContext.Provider value={contextValue}>
      {children}
    </AllowancesContext.Provider>
  );
};

export const useAllowances = () => {
  const {
    allowances,
    refreshAllowances,
    isLoading,
    revokeAllowance: revoke,
  } = useContext(AllowancesContext);
  return { allowances, refreshAllowances, revoke, isLoading };
};
