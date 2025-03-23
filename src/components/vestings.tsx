"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Vesting from "@/components/vesting";
import useVestings from "@/hooks/useVestings";
import { ConnectButton, useAccountModal } from "@rainbow-me/rainbowkit";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { invariant } from "ts-invariant";
import { useAccount } from "wagmi";

export default function Vestings() {
  const account = useAccount();
  const vestings = useVestings(account.address);
  const searchParams = useSearchParams();
  const { openAccountModal } = useAccountModal();
  const vesting = useMemo(() => {
    if (!vestings.data) return null;
    const selected = vestings.data.data.find(
      (v) => `${v.chainId}-${v.contractAddress}` === searchParams.get("vesting")
    );
    if (selected) return selected;
    return vestings.data.data[0];
  }, [vestings.data, searchParams]);

  if (!account.isConnected) return <ConnectButton />;
  invariant(account.address, "Account address is required");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <nav className="flex justify-between gap-2 overflow-x-auto">
        <Button
          variant="outline"
          size="sm"
          className="whitespace-nowrap"
          onClick={openAccountModal}
        >
          {account.address.slice(0, 6) + "..." + account.address.slice(-4)}
        </Button>
        {vestings.data && vestings.data.pagination.totalCount > 1 && (
          <div className="flex justify-end gap-2">
            {vestings.data.data.map((vesting) => (
              <Button
                key={`${vesting.chainId}-${vesting.contractAddress}`}
                size="sm"
                variant="outline"
                className="whitespace-nowrap"
                asChild
              >
                <Link
                  href={`?vesting=${vesting.chainId}-${vesting.contractAddress}`}
                >
                  {vesting.name}
                </Link>
              </Button>
            ))}
          </div>
        )}
      </nav>
      {vestings.isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:auto-rows-fr lg:grid-cols-2 lg:grid-rows-1">
          <Skeleton className="h-[671px]" />
          <Skeleton className="h-[671px]" />
        </div>
      ) : vestings.error ? (
        <p className="text-destructive">Error: {vestings.error.message}</p>
      ) : !vesting ? (
        <p className="text-muted-foreground">No vesting found</p>
      ) : (
        <Vesting vesting={vesting} account={account.address} />
      )}
    </div>
  );
}
