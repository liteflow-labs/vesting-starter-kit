import liteflow from "@/lib/liteflow";
import { useQuery } from "@tanstack/react-query";

export default function useVestings(holder: `0x${string}` | undefined) {
  return useQuery({
    queryFn: async () => {
      const res = await liteflow.vesting.list({ holder });
      if (res.error) throw new Error(res.error.message);
      return res.data;
    },
    enabled: !!holder,
    queryKey: ["vestings", { holder }],
  });
}
