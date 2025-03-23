import liteflow from "@/lib/liteflow";
import { useQuery } from "@tanstack/react-query";

export const vestingPositionKey = (opts: {
  chainId: number;
  contract: string;
  holder: string;
}) => ["vesting-position", opts];

export default function useVestingPosition({
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
      const res = await liteflow.vestingPosition.retrieve(
        chainId,
        contract,
        holder
      );
      if (res.error) throw new Error(res.error.message);
      return res.data;
    },
    enabled: !!holder,
    queryKey: vestingPositionKey({ holder, chainId, contract }),
  });
}
