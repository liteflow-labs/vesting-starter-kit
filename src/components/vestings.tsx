"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Vesting from "@/components/vesting";
import useVestings from "@/hooks/useVestings";
import { ConnectButton, useAccountModal } from "@rainbow-me/rainbowkit";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { invariant } from "ts-invariant";
import { useAccount } from "wagmi";

type Props = {
  chainId: number;
  tokenAddress: `0x${string}`;
};

export default function Vestings({ chainId, tokenAddress }: Props) {
  const account = useAccount();
  const vestings = useVestings({
    holder: account.address,
    chainId,
    tokenAddress,
  });
  const searchParams = useSearchParams();
  const { openAccountModal } = useAccountModal();
  const vesting = useMemo(() => {
    if (!vestings.data) return null;
    const selected = vestings.data.data.find(
      (v) =>
        `${v.chainId.toString()}-${v.contractAddress}` ===
        searchParams.get("vesting")
    );
    if (selected) return selected;
    return vestings.data.data[0];
  }, [vestings.data, searchParams]);

  if (!account.isConnected)
    return (
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Connect your wallet to view your vesting details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectButton />
        </CardContent>
      </Card>
    );
  invariant(account.address, "Account address is required");

  return (
    <div className="mx-auto my-6 w-full max-w-6xl space-y-4">
      <nav className="flex justify-between gap-2 overflow-x-auto p-1">
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
            <Tabs
              value={
                vesting
                  ? `${vesting.chainId.toString()}-${vesting.contractAddress}`
                  : undefined
              }
            >
              <TabsList className="h-auto bg-transparent p-0">
                {vestings.data.data.map((vesting) => (
                  <TabsTrigger
                    value={`${vesting.chainId.toString()}-${vesting.contractAddress}`}
                    key={`${vesting.chainId.toString()}-${vesting.contractAddress}`}
                    asChild
                  >
                    <Link
                      className="h-8"
                      href={`?vesting=${vesting.chainId.toString()}-${vesting.contractAddress}`}
                    >
                      {vesting.name}
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
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
        <Card>
          <CardHeader>
            <CardTitle>No vesting found</CardTitle>
            <CardDescription>No vesting found for this account</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please ensure you are connected to the correct wallet or contact
              the vesting administrator.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Vesting vesting={vesting} account={account.address} />
      )}
    </div>
  );
}
