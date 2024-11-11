"use client";

import { ReactNode } from "react";
import { useMemo } from "react";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

import {
  CoinbaseWalletAdapter,
  MathWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { clusterApiUrl } from "@solana/web3.js";

type WalletContextProviderProps = {
  children: ReactNode;
};

const quicknodeEndpoint =
  process.env.NEXT_PUBLIC_RPC || clusterApiUrl("devnet");

export default function WalletContextProvider({
  children,
}: WalletContextProviderProps) {
  //const network = WalletAdapterNetwork.Devnet;

  // Initiate auto connect
  //const { autoConnect } = useWallet();

  // We can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => quicknodeEndpoint, []);

  // Define wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new MathWalletAdapter(),
      new TrustWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
