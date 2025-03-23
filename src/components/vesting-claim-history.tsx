"use client";

import DateFormatter from "@/components/date-formatter";
import NumberFormatter from "@/components/number-formatter";
import useVestingClaims from "@/hooks/useVestingClaims";
import { cn } from "@/lib/utils";
import { GetVestingsResponse } from "@liteflow/sdk/dist/client";
import { CheckCircle2, Clock } from "lucide-react";
import { useMemo } from "react";
import { useChains } from "wagmi";

type Props = {
  vesting: GetVestingsResponse["data"][number];
  account: `0x${string}`;
};

export default function VestingClaimHistory({ vesting, account }: Props) {
  const claims = useVestingClaims({
    chainId: vesting.chainId,
    contract: vesting.contractAddress as `0x${string}`,
    holder: account,
  });
  const chains = useChains();
  const chain = useMemo(
    () => chains.find((chain) => chain.id === vesting.chainId),
    [chains, vesting.chainId]
  );

  if (claims.isLoading)
    return <div className="text-muted-foreground">Loading...</div>;
  if (claims.isError) return <div>Error: {claims.error.message}</div>;
  if (!claims.data) return null;
  if (claims.data.data.length === 0)
    return (
      <div className="py-8 text-center text-muted-foreground">
        No claims have been made yet
      </div>
    );
  return (
    <div className="space-y-2">
      {claims.data.data.map((claim, i) => {
        const isPending = "isPending" in claim && claim.isPending === true;
        return (
          <div
            key={i}
            className={cn(
              "flex items-center justify-between gap-2 rounded-md p-2 text-sm hover:bg-muted",
              isPending && "animate-pulse bg-primary/5"
            )}
          >
            {isPending ? (
              <Clock className="h-4 w-4 animate-spin text-amber-500" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            <DateFormatter time>{claim.date}</DateFormatter>
            <span className="flex-1" />
            <NumberFormatter decimals={claim.token.decimals}>
              {claim.amount}
            </NumberFormatter>{" "}
            {vesting.token.symbol}
            <a
              href={`${chain?.blockExplorers?.default.url}/tx/${claim.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-[120px] truncate text-xs text-primary hover:underline"
            >
              View
            </a>
          </div>
        );
      })}
    </div>
  );
}
