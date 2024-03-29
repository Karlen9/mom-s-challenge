import { useGetTokenInfo } from "@/hooks/useGetTokenInfo";
import { formatUnits } from "viem";
import { useAllowances } from "@/contexts/useAllowances";
import { TAddress } from "../shared/types/types";

type TProps = {
  contractAddress: TAddress;
  nameOfAllowance: string;
  amount?: bigint;
  onRevoke?: () => void;
  tokenAddress?: TAddress;
};

export const AllowanceItem = ({
  contractAddress,
  tokenAddress,
  amount,
}: TProps) => {
  const { tokenDecimals, tokenSymbol, loading } = useGetTokenInfo(tokenAddress);

  const { revoke } = useAllowances();

  const amountOfTokens =
    !loading && formatUnits(amount ?? BigInt(0), tokenDecimals || 0);

  if (!tokenAddress) return;
  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="px-6 py-3 truncate max-w-md">{contractAddress}</td>
      {loading ? (
        <td>Token name...</td>
      ) : (
        <td className="px-6 py-3">{tokenSymbol}</td>
      )}
      <td className="px-6 py-3 truncate max-w-md">{amountOfTokens}</td>

      <td className="py-3">
        <button
          className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => revoke(contractAddress, tokenAddress)}
        >
          Revoke
        </button>
      </td>
    </tr>
  );
};
