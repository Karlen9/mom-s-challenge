export type TAllowances = TAllowance[];

export type TAllowance = {
  address: TAddress;
  args: {
    owner: TAddress;
    sender: TAddress;
    value: bigint;
  };
  blockHash: TAddress;
  blockNumber: bigint;
  data: TAddress;
  eventName: "Approval";
  logIndex: number;
  removed: boolean;
  topics: TAddress[];
  transactionHash: TAddress;
  transactionIndex: number;
};

export type TAddress = `0x${string}`;
