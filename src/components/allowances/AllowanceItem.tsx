import { useGetTokenInfo } from "@/hooks/useGetTokenInfo";
import { useAllowances } from "@/contexts/useAllowances";
import { TAddress } from "../shared/types/types";
import { getTokenAmount } from "../shared/utils/getTokenAmount";

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

  const tokenAmount = getTokenAmount(tokenDecimals, amount);

  if (!tokenAddress) return;
  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="px-6 py-3 max-w-56">
        <p className="truncate">{contractAddress}</p>
      </td>
      {loading ? (
        <td>Token name...</td>
      ) : (
        <td className="px-6 py-3">{tokenSymbol}</td>
      )}
      <td className="px-6 py-3 truncate max-w-md">{tokenAmount}</td>
      <td className="py-3 px-3 max-w-8">
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
