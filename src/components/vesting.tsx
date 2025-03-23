"use client";

import ClaimForm from "@/components/claim-form";
import DateFormatter from "@/components/date-formatter";
import NumberFormatter from "@/components/number-formatter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import VestingClaimHistory from "@/components/vesting-claim-history";
import VestingGraph from "@/components/vesting-graph";
import VestingProgress from "@/components/vesting-progress";
import useVestingPosition from "@/hooks/useVestingPosition";
import { GetVestingsResponse } from "@liteflow/sdk/dist/client";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import Image from "next/image";

type Props = {
  vesting: GetVestingsResponse["data"][number];
  account: `0x${string}`;
};

export default function Vesting({ vesting, account }: Props) {
  const position = useVestingPosition({
    chainId: vesting.chainId,
    contract: vesting.contractAddress as `0x${string}`,
    holder: account,
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:auto-rows-fr lg:grid-cols-2 lg:grid-rows-1">
      <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{vesting.name}</CardTitle>
          <CardDescription>
            Token vesting details for this allocation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-72 pt-2">
            <VestingGraph vesting={vesting} position={position.data} />
          </div>
        </CardContent>

        <Separator className="my-4" />

        <CardContent className="flex-grow">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Start Date</div>
                <div className="flex items-center font-medium">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  <DateFormatter>{vesting.startDate}</DateFormatter>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Cliff End</div>
                <div className="flex items-center font-medium">
                  <ArrowRight className="mr-1 h-4 w-4 text-muted-foreground" />
                  <DateFormatter>{vesting.cliffDate}</DateFormatter>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">End Date</div>
                <div className="flex items-center font-medium">
                  <CheckCircle2 className="mr-1 h-4 w-4 text-muted-foreground" />
                  <DateFormatter>{vesting.endDate}</DateFormatter>
                </div>
              </div>
            </div>

            <VestingProgress vesting={vesting} />

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Allocation</div>
                <div className="flex items-center gap-2 text-xl font-semibold">
                  {position.data ? (
                    <NumberFormatter decimals={position.data.token.decimals}>
                      {position.data.totalAllocation}
                    </NumberFormatter>
                  ) : (
                    <Skeleton className="h-5 w-20" />
                  )}{" "}
                  {vesting.token.symbol}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Vested</div>
                <div className="flex items-center gap-2 text-xl font-semibold">
                  {position.data ? (
                    <NumberFormatter decimals={position.data.token.decimals}>
                      {position.data.vestedAllocation}
                    </NumberFormatter>
                  ) : (
                    <Skeleton className="h-5 w-20" />
                  )}{" "}
                  {vesting.token.symbol}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl">
            {vesting.name} Claims
          </CardTitle>
          <CardDescription>
            Claim available tokens and view transaction history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center rounded-lg border bg-primary/5 p-6">
              <div className="mb-1 text-sm text-muted-foreground">
                Claimable Amount
              </div>
              <div className="mb-6 flex items-center gap-2 text-3xl font-bold text-primary">
                <Image
                  src={vesting.token.image}
                  width={24}
                  height={24}
                  alt={vesting.token.symbol}
                  className="rounded-full"
                />
                {position.data ? (
                  <NumberFormatter decimals={position.data.token.decimals}>
                    {position.data.claimableAmount}
                  </NumberFormatter>
                ) : (
                  <Skeleton className="h-6 w-20" />
                )}{" "}
                {vesting.token.symbol}
              </div>

              <ClaimForm vesting={vesting} position={position.data} />
            </div>
          </div>
        </CardContent>

        <Separator className="my-2" />

        <CardHeader>
          <CardTitle>
            <h3 className="text-lg font-medium">Claim History</h3>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative h-full w-full">
          <div className="absolute inset-0">
            <ScrollArea className="h-full w-full px-6 py-0">
              <VestingClaimHistory vesting={vesting} account={account} />
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
