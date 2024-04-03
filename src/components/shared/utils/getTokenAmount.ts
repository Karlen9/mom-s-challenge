import { formatUnits } from "viem";

/**
 *
 * @param {number} decimals - Token decimals in ERC20
 * @param {bigint} amountInBigint - Amount of token in bigint
 * @returns {string}
 */

export const getTokenAmount = (
  decimals?: number,
  amountInBigint?: bigint
): string => {
  return formatUnits(amountInBigint ?? BigInt(0), decimals || 0);
};
