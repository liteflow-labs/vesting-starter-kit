"use client";

import { Button } from "@/components/ui/button";
import { vestingClaimsKey } from "@/hooks/useVestingClaims";
import { vestingPositionKey } from "@/hooks/useVestingPosition";
import liteflow from "@/lib/liteflow";
import {
  GetVestingsByChainIdByAddressClaimsResponse,
  GetVestingsByChainIdByAddressPositionsByUserAddressResponse,
  GetVestingsByChainIdByAddressResponse,
} from "@liteflow/sdk/dist/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { PropsWithChildren } from "react";
import { Address } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { useAccount, useClient, useSwitchChain, useWriteContract } from "wagmi";

export default function ClaimForm({
  vesting,
  position,
}: PropsWithChildren<{
  vesting: GetVestingsByChainIdByAddressResponse;
  position:
    | GetVestingsByChainIdByAddressPositionsByUserAddressResponse
    | undefined;
}>) {
  const account = useAccount();
  const queryClient = useQueryClient();
  const client = useClient({ chainId: vesting.chainId });
  const chain = useSwitchChain();
  const claimTx = useWriteContract();
  const claim = useMutation({
    mutationFn: async () => {
      if (!position) throw new Error("No position found");
      if (!client) throw new Error("Client not found");
      if (!account.address) throw new Error("No account connected");

      await chain.switchChainAsync({ chainId: vesting.chainId });
      const hash = await claimTx.writeContractAsync({
        chainId: vesting.chainId,
        abi: [
          {
            inputs: [],
            name: "claim",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ] as const,
        address: vesting.contractAddress as Address,
        functionName: "claim",
      });

      // Optimistically update the position data to reflect the claim
      queryClient.setQueryData(
        vestingPositionKey({
          chainId: vesting.chainId,
          contract: vesting.contractAddress,
          holder: account.address,
        }),
        (
          oldData: GetVestingsByChainIdByAddressPositionsByUserAddressResponse
        ) => ({ ...oldData, claimableAmount: "0" })
      );

      queryClient.setQueryData(
        vestingClaimsKey({
          chainId: vesting.chainId,
          contract: vesting.contractAddress,
          holder: account.address,
        }),
        (
          oldData: GetVestingsByChainIdByAddressClaimsResponse & {
            idPending?: boolean;
          }
        ) => ({
          ...oldData,
          data: [
            {
              amount: position.claimableAmount,
              date: new Date(),
              chainId: vesting.chainId,
              contractAddress: vesting.contractAddress,
              token: vesting.token,
              transactionHash: hash,
              isPending: true,
            } satisfies GetVestingsByChainIdByAddressClaimsResponse["data"][number] & {
              isPending: boolean;
            },
            ...oldData.data,
          ],
        })
      );

      await waitForTransactionReceipt(client, { hash });

      // Polling to wait until the indexer has indexed the claim
      let attempts = 0;
      while (attempts < 10) {
        const claims = await liteflow.vestingClaim.list(
          vesting.chainId,
          vesting.contractAddress,
          { holder: account.address as Address }
        );

        const foundClaim = (claims.data?.data || []).find(
          (claim) => claim.transactionHash.toLowerCase() === hash.toLowerCase()
        );
        if (foundClaim) break;

        await new Promise((resolve) => setTimeout(resolve, 1000));
        attempts++;
      }

      // Invalidate queries to get the real data
      await queryClient.invalidateQueries({
        queryKey: vestingPositionKey({
          chainId: vesting.chainId,
          contract: vesting.contractAddress,
          holder: account.address as Address,
        }),
      });

      await queryClient.invalidateQueries({
        queryKey: vestingClaimsKey({
          chainId: vesting.chainId,
          contract: vesting.contractAddress,
          holder: account.address,
        }),
      });
    },
  });

  if (claim.isPending) {
    return (
      <Button className="w-full" size="lg" disabled>
        <Loader2Icon className="mr-1 size-4 animate-spin" />
        Claiming...
      </Button>
    );
  }
  return (
    <Button
      className="w-full"
      size="lg"
      onClick={() => claim.mutate()}
      disabled={!position || BigInt(position.claimableAmount) <= BigInt(0)}
    >
      Claim
    </Button>
  );
}
