import * as bs58 from "bs58";

import {
  fetchCandyMachine,
  mintV2,
  safeFetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";

import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";

import {
  generateSigner,
  publicKey,
  some,
  transactionBuilder,
  Umi,
} from "@metaplex-foundation/umi";

import { toast } from "@/hooks/use-toast";

const candyMachineAddress = publicKey(
  process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!,
);

const treasury = publicKey(process.env.NEXT_PUBLIC_TREASURY!);

export const publicCandyMachine = async (umi: Umi) => {
  // Fetch the Candy Machine.
  const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
  // Fetch the Candy Guard.
  const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);

  try {
    // Mint from the Candy Machine.
    const nftMint = generateSigner(umi);
    const transaction = transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        mintV2(umi, {
          candyMachine: candyMachine.publicKey,
          candyGuard: candyGuard?.publicKey,
          nftMint,
          collectionMint: candyMachine.collectionMint,
          collectionUpdateAuthority: candyMachine.authority,
          group: "PUBLIC",
          mintArgs: {
            solPayment: some({ destination: treasury }),
          },
        }),
      );

    const { signature } = await transaction.sendAndConfirm(umi, {
      confirm: { commitment: "confirmed" },
    });

    const txid = bs58.encode(signature);
    console.log("success", `Mint successful! ${txid}`);

    toast({
      title: "Mint successful!",
      description: `Transaction ID: ${txid}`,
    });
  } catch (error: any) {
    toast({
      title: "Mint failed!",
      description: error?.message,
    });
    console.log("error", `Mint failed! ${error?.message}`);
  }
};
