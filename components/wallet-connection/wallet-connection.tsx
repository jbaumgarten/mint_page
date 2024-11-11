"use client";

import Image from "next/image";

import React, { useEffect, useState } from "react";

import { WalletName } from "@solana/wallet-adapter-base";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { IconChevronDown } from "@tabler/icons-react";

import DisconnectDropdown from "@/components/wallet-connection/disconnect-dropdown";
import WalletButton from "@/components/wallet-connection/wallet-button";
import WalletDialog from "@/components/wallet-connection/wallet-dialog";

import { formatBalance } from "@/lib/misc";

function WalletConnection() {
  const { connection } = useConnection();
  const { select, wallets, publicKey, disconnect, connecting } = useWallet();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!connection || !publicKey) return;

    async function updateBalance() {
      if (publicKey === null) return;

      const info = await connection.getAccountInfo(publicKey);
      if (info) {
        setBalance(info.lamports / LAMPORTS_PER_SOL);
      }
    }

    updateBalance();
    const id = connection.onAccountChange(publicKey, (info) => {
      setBalance(info.lamports / LAMPORTS_PER_SOL);
    });

    return () => {
      connection.removeAccountChangeListener(id);
    };
  }, [publicKey, connection]);

  async function handleWalletSelect(walletName: WalletName) {
    try {
      await select(walletName);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  }

  async function handleDisconnect() {
    await disconnect();
    setIsDropdownOpen(false);
  }

  return (
    <div className="relative">
      {!publicKey ? (
        <WalletButton onClick={() => setIsDialogOpen(true)}>
          {connecting ? "Connecting..." : "Connect Wallet"}
        </WalletButton>
      ) : (
        <div className="relative">
          <WalletButton
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2"
          >
            <span className="w-24 truncate md:w-32">
              {publicKey.toBase58()}
            </span>
            <span>{balance ? `${formatBalance(balance)} SOL` : "0 SOL"}</span>
            <IconChevronDown size={20} />
          </WalletButton>
          <DisconnectDropdown
            isOpen={isDropdownOpen}
            onDisconnect={handleDisconnect}
            onClose={() => setIsDropdownOpen(false)}
          />
        </div>
      )}

      <WalletDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <h2 className="mb-4 text-xl font-bold">Select a wallet</h2>
        <div className="space-y-2">
          {wallets.map((wallet) => (
            <button
              key={wallet.adapter.name}
              onClick={() => handleWalletSelect(wallet.adapter.name)}
              className="flex w-full items-center space-x-3 rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Image
                src={wallet.adapter.icon}
                alt={wallet.adapter.name}
                width={30}
                height={30}
              />
              <span>{wallet.adapter.name}</span>
            </button>
          ))}
        </div>
      </WalletDialog>
    </div>
  );
}

export default WalletConnection;
