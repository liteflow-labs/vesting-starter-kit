import liteflow from "@/lib/liteflow";
import { useQuery } from "@tanstack/react-query";

export const vestingClaimsKey = (opts: {
  chainId: number;
  contract: string;
  holder: string;
}) => ["vesting-claims", opts];

export default function useVestingClaims({
  chainId,
  contract,
  holder,
}: {
  chainId: number;
  contract: `0x${string}`;
  holder: `0x${string}`;
}) {
  return useQuery({
    queryFn: async () => {
      const res = await liteflow.vestingClaim.list(chainId, contract, {
        holder,
      });
      if (res.error) throw new Error(res.error.message);
      return res.data;
    },
    enabled: !!holder,
    queryKey: vestingClaimsKey({ holder, chainId, contract }),
  });
}
