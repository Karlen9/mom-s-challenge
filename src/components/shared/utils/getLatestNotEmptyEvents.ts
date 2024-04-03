import { TAllowance, TAllowances } from "../types/types";
import { filterNotEmptyEvents } from "./filterNotEmptyEvents";

/**
 *
 * @param {TAllowances} approvalEvents - Array of approval events
 * @returns {TAllowances}
 */

export const getLatestNotEmptyEvents = (
  approvalEvents: TAllowances
): TAllowances => {
  const senderMap = approvalEvents.reduce(
    (map: Record<string, TAllowance>, obj: TAllowance) => {
      // Check if the current object's address is already in the map
      if (obj.args.sender in map) {
        // If yes, compare the values and update if necessary
        if (obj.blockNumber > map[obj.args.sender].blockNumber) {
          map[obj.args.sender] = obj;
        }
      } else {
        // If not, add it to the map
        map[obj.args.sender] = obj;
      }
      return map;
    },
    {}
  );

  // Convert the map back to an array of objects and filter results with empty values
  const resultArray: TAllowances = filterNotEmptyEvents(
    Object.values(senderMap)
  );

  return resultArray;
};
