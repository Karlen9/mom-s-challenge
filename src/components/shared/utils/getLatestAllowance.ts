import { Allowance, Allowances } from "../types/types";

export const filterMaxValueByAddress = (arr: Allowances) => {
  const addressMap = arr.reduce((map: Record<string, Allowance>, obj: Allowance) => {
      // Check if the current object's address is already in the map
      if (obj.address in map) {
          // If yes, compare the values and update if necessary
          if (obj.blockNumber > map[obj.address].blockNumber) {
              map[obj.address] = obj;
          }
      } else {
          // If not, add it to the map
          map[obj.address] = obj;
      }
      return map;
  }, {}); 
 
  // Convert the map back to an array of objects
  const resultArray = Object.values(addressMap);
  return resultArray;
}