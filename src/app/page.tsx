"use client";

import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { WagmiProvider } from "wagmi";
import { App } from "@/components/App";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from "../config/config";
import { AllowancesProvider } from "@/contexts/useAllowances";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={lightTheme()}>
          <ErrorBoundary>
            <AllowancesProvider>
              <App />
            </AllowancesProvider>
          </ErrorBoundary>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
