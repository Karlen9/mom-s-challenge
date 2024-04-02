import { FormProvider, useForm } from "react-hook-form";
import { InputAddress } from "./InputAddress";
import { useAccount } from "wagmi";
import { useEffect, memo, useState } from "react";
import { useAllowances } from "@/contexts/useAllowances";
import { TAddress } from "../shared/types/types";
import { isHex } from "viem";
import { toast } from "react-toastify";

export type FormField = {
  tokenaddress: TAddress | "";
};

export const TokenAddressForm = memo(function TokenAddress() {
  const form = useForm<FormField>({
    defaultValues: { tokenaddress: "" },
    mode: "onChange",
  });

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { handleSubmit, formState, reset, watch } = form;
  const { errors } = formState;

  const { chainId } = useAccount();

  const { address } = useAccount();

  const watchTokenAddress = watch("tokenaddress");

  const { updateAllowances } = useAllowances();

  useEffect(() => {
    reset({ tokenaddress: "" });
  }, [address, chainId, reset]);

  useEffect(() => {
    if (address && chainId) return setIsWalletConnected(true);
    return setIsWalletConnected(false);
  }, [address, chainId]);

  const onSubmit = (data: FormField) => {
    if (!address)
      return toast.error("Please, connect the wallet", {
        position: "top-center",
        hideProgressBar: true,
      });
    if (!isHex(watchTokenAddress))
      return toast.error("Invalid token address", {
        position: "top-center",
        hideProgressBar: true,
      });
    updateAllowances(data.tokenaddress || "0x");
  };

  return (
    <>
      <div className="w-96">
        <FormProvider {...form}>
          <form
            className="flex flex-col max-w-sm mx-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-5">
              <InputAddress
                options={{
                  disabled: !isWalletConnected,
                  required: {
                    value: true,
                    message: "Address is required",
                  },
                }}
                name="tokenaddress"
                label="Token address"
              />

              <p className="text-sm text-red-600 mt-1 ml-1">
                {errors.tokenaddress?.message}
              </p>
            </div>

            <button
              disabled={!isWalletConnected}
              className="flex disabled:bg-gray-700 disabled:cursor-not-allowed justify-center text-white bg-blue-700 hover:bg-blue-800 text-center focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
            {!isWalletConnected && (
              <p className="text-center mt-4 text-red-800">
                Please, connect the wallet
              </p>
            )}
          </form>
        </FormProvider>
      </div>
    </>
  );
});
