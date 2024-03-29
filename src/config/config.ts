import "@rainbow-me/rainbowkit/styles.css";
import { http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, localhost } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "mom-challenge",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  chains: [mainnet, localhost],

  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_API_KEY || ""),
    [localhost.id]: http(process.env.NEXT_PUBLIC_LOCALHOST_KEY || ""),
  },
});
