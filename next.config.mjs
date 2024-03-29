/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    JSON_RPC_URL: {
      1: process.env.RPC_URL_MAINNET,
      1337: process.env.RPC_URL_LOCALHOST
    }
  }
};

export default nextConfig;
