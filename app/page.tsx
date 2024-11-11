"use client";

import Image from "next/image";

import React, { useCallback, useMemo } from "react";

import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";

import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

import { clusterApiUrl } from "@solana/web3.js";

import { Button } from "@/components/ui/button";
import WalletConnection from "@/components/wallet-connection/wallet-connection";

import { goldRoleCandyMachine } from "@/lib/candy-machines/gold-role/gold-role-candy-machine";
import { holderCandyMachine } from "@/lib/candy-machines/holder/holder-candy-machine";
import { publicCandyMachine } from "@/lib/candy-machines/public/public-candy-machine";

type CandyMachine = "GoldRole" | "Holder" | "Public";

type MintOption = {
  type: string;
  price: string;
  candyMachine: CandyMachine;
};

const mintOptions: MintOption[] = [
  { type: "Gold role", price: "1 free mint", candyMachine: "GoldRole" },
  { type: "Holder", price: "0,25 sol", candyMachine: "Holder" },
  { type: "Public", price: "0,4 sol", candyMachine: "Public" },
];

const quicknodeEndpoint =
  process.env.NEXT_PUBLIC_RPC || clusterApiUrl("devnet");

const MintPage = () => {
  //const wallet = useWallet();
  const umi = useMemo(
    () =>
      createUmi(quicknodeEndpoint)
        .use(mplCandyMachine())
        .use(mplTokenMetadata()),
    [],
  );

  const canMint = () => {
    if (!publicKey) {
      console.log("error", "Wallet not connected!");
      return false;
    }

    return true;
  };

  const onClickMint = useCallback(
    async (candyMachine: CandyMachine) => {
      if (!canMint()) return;

      switch (candyMachine) {
        case "GoldRole":
          await goldRoleCandyMachine(umi);
          break;
        case "Holder":
          await holderCandyMachine(umi);
          break;
        case "Public":
          await publicCandyMachine(umi);
          break;
      }
    },
    [umi],
  );

  return (
    <div className="min-h-screen space-y-10 bg-zinc-50 p-4">
      <div className="mb-8 flex justify-end">
        <WalletConnection />
      </div>

      <div className="mb-8 flex justify-center">
        <Image
          src="/assets/banner.png"
          alt="Banner"
          width={600}
          height={38}
          priority
        />
      </div>

      <div className="mx-auto space-y-4 lg:w-1/3">
        {mintOptions.map(({ type, price, candyMachine }, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border border-zinc-200 p-4"
          >
            <span className="text-lg">
              {type} : {price}
            </span>
            <Button
              className="bg-zinc-600 px-8 text-white hover:bg-zinc-700"
              onClick={() => onClickMint(candyMachine)}
            >
              MINT
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MintPage;
