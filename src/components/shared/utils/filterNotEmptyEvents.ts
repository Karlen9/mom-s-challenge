import { TAllowances } from "../types/types";
/**
 *
 * @param {TAllowances} events - Array of Approval Events
 * @returns {TAllowances}
 */

export const filterNotEmptyEvents = (events: TAllowances): TAllowances => {
  return events.filter((item) => item.args.value !== BigInt(0));
};
