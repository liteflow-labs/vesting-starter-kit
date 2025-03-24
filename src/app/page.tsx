import Vestings from "@/components/vestings";
import { getAddress } from "viem";
import { z } from "zod";

const env = z
  .object({
    NEXT_PUBLIC_CHAIN_ID: z.coerce.number(),
    NEXT_PUBLIC_TOKEN_ADDRESS: z.string().transform((val) => getAddress(val)),
  })
  .parse({
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_TOKEN_ADDRESS: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
  });

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
      <Vestings
        chainId={env.NEXT_PUBLIC_CHAIN_ID}
        tokenAddress={env.NEXT_PUBLIC_TOKEN_ADDRESS}
      />
    </div>
  );
}
