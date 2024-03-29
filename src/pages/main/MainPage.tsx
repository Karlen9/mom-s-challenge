import { AllowancesList } from "@/components/allowances/AllowancesList";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { TokenAddressForm } from "@/components/token-address-form/TokenAddressForm";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ToastContainer } from "react-toastify";
import { erc20Abi } from "viem";
import { useWriteContract } from "wagmi";

export const MainPage = () => {
  const { data: hash, isPending, writeContract } = useWriteContract();

  //here for testing approvals
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
