import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function WalletButton({
  children,
  onClick,
  className = "",
  ...props
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md bg-primary px-3 py-1.5 font-medium text-white transition-colors duration-300 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
