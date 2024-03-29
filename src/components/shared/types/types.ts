export type Allowances = Allowance[];

export type Allowance = {
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
