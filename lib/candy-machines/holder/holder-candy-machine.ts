import * as bs58 from "bs58";

import {
  fetchCandyMachine,
  getMerkleProof,
  getMerkleRoot,
  mintV2,
  route,
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
import { allowList } from "@/lib/candy-machines/holder/allow-list";

const candyMachineAddress = publicKey(
  process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!,
);
const treasury = publicKey(process.env.NEXT_PUBLIC_TREASURY!);

export const holderCandyMachine = async (umi: Umi) => {
  // Fetch the Candy Machine.
  const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
  // Fetch the Candy Guard.
  const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);

  try {
    const nftMint = generateSigner(umi);
    await route(umi, {
      candyMachine: candyMachine.publicKey,
      candyGuard: candyGuard?.publicKey,
      group: "OG",
      guard: "allowList",
      routeArgs: {
        path: "proof",
        merkleRoot: getMerkleRoot(allowList),
        merkleProof: getMerkleProof(allowList, publicKey(umi.identity)),
      },
    }).sendAndConfirm(umi);

    // Mint from the Candy Machine.
    const transaction = transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        mintV2(umi, {
          candyMachine: candyMachine.publicKey,
          candyGuard: candyGuard?.publicKey,
          nftMint,
          collectionMint: candyMachine.collectionMint,
          collectionUpdateAuthority: candyMachine.authority,
          group: "OG",
          mintArgs: {
            allowList: some({ merkleRoot: getMerkleRoot(allowList) }),
            mintLimit: some({ id: 2 }),
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast({
      title: "Mint failed!",
      description: error?.message,
    });
    console.log("error", `Mint failed! ${error?.message}`);
  }
};
