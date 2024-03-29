import { TokenAddressForm } from "./token-address-form/TokenAddressForm";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ToastContainer } from "react-toastify";
import { AllowancesList } from "./allowances/AllowancesList";
import { PageWrapper } from "./shared/PageWrapper";

export const App = () => {
  return (
    <PageWrapper>
      <div className="flex p-4 w-full justify-end min-h-20">
        <ConnectButton />
      </div>
      <div className="flex w-full justify-center mt-10">
        <TokenAddressForm />
      </div>
      <div className="mt-5 p-x-24">
        <AllowancesList />
      </div>
      <ToastContainer />
    </PageWrapper>
  );
};
