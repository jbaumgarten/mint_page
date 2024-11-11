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

type WalletContextProviderProps = {
  children: ReactNode;
};

export default function WalletContextProvider({
  children,
}: WalletContextProviderProps) {
  //const network = WalletAdapterNetwork.Devnet;

  // Initiate auto connect
  //const { autoConnect } = useWallet();

  // We can also provide a custom RPC endpoint.
  const endpoint = useMemo(
    () =>
      "https://mainnet.helius-rpc.com/?api-key=a45ca7f0-c986-47b3-9459-c01310d348b6",
    [],
  );

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
