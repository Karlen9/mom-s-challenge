import { AllowanceItem } from "./AllowanceItem";
import { filterMaxValueByAddress } from "../shared/utils/filterMaxValueByAddress";
import { useAllowances } from "@/contexts/useAllowances";
import { memo, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Allowances } from "@/components/shared/types/types";

export const AllowancesList = memo(function AllowancesList() {
  const { allowances } = useAllowances();
  const [filteredArray, setFilteredArray] = useState<Allowances>([]);

  const resultAllowances = filterMaxValueByAddress(allowances ?? []).filter(
    (item) => item.args.value !== BigInt(0)
  );

  const { chainId } = useAccount();

  const { address } = useAccount();

  useEffect(() => {
    setFilteredArray(resultAllowances);
  }, [allowances]);

  useEffect(() => {
    setFilteredArray([]);
  }, [chainId, address]);

  return (
    <>
      {filteredArray && filteredArray?.length > 0 ? (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Address</th>
              <th className="px-6 py-3">Token</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Revoke</th>
            </tr>
          </thead>
          <tbody>
            {filteredArray.length &&
              filteredArray.map((item) => (
                <AllowanceItem
                  key={item.transactionHash}
                  contractAddress={item.args.sender}
                  nameOfAllowance={item.eventName}
                  amount={item.args.value}
                  tokenAddress={item.address}
                />
              ))}
          </tbody>
        </table>
      ) : allowances === null ? (
        <p className="mt-8 tracking-tight text-gray-500 text-center md:text-lg dark:text-gray-400">
          Pass contract address to manage allowances
        </p>
      ) : filteredArray?.length === 0 ? (
        <p className="mt-8 tracking-tight text-gray-500 text-center md:text-lg dark:text-gray-400">
          No allowances found
        </p>
      ) : null}
    </>
  );
});
