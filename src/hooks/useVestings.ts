import liteflow from "@/lib/liteflow";
import { useQuery } from "@tanstack/react-query";

export default function useVestings({
  holder,
  chainId,
  tokenAddress,
}: {
  holder: `0x${string}` | undefined;
  chainId: number;
  tokenAddress: `0x${string}`;
}) {
  return useQuery({
    queryFn: async () => {
      const res = await liteflow.vesting.list({
        holder,
        chainId,
        tokenAddress,
      });
      if (res.error) throw new Error(res.error.message);
      return res.data;
    },
    enabled: !!holder,
    queryKey: ["vestings", { holder, chainId, tokenAddress }],
  });
}
