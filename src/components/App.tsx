import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PageWrapper } from "./shared/PageWrapper";
import { TokenAddressForm } from "./token-address-form/TokenAddressForm";
import { AllowancesList } from "./allowances/AllowancesList";
import { useWriteContract } from "wagmi";
import { erc20Abi } from "viem";
import { ToastContainer } from "react-toastify";

export const App = () => {
  const { data: hash, isPending, writeContract } = useWriteContract();

  const approve = () => {
    try {
      const hash = writeContract({
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        abi: erc20Abi,
        functionName: "approve",
        args: [ 
          "0xF980B4A4194694913Af231De69AB4593f5E0fCDc",
          BigInt(1000000000000000),
        ],
      });

      setTimeout(() => {
        console.log({ hash });
      });
    } catch (error) {
      console.log(error);
    }
  };
 
  return (
    <PageWrapper>
      <div className="flex p-4 w-full justify-end">
        <ConnectButton />
      </div>
      <div className="flex w-full justify-center mt-10">
        <TokenAddressForm />
      </div>
      <button onClick={approve}>Approve</button>
      <div className="mt-5">
        <AllowancesList />
      </div>
      <ToastContainer />
    </PageWrapper>
  );
};
