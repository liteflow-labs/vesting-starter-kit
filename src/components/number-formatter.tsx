import { formatUnits } from "viem";

export default function NumberFormatter({
  children,
  decimals = 0,
}: {
  children: bigint | undefined | string;
  decimals?: number;
}) {
  if (children === undefined) return null;
  const formattedNumber = formatUnits(BigInt(children), decimals);
  const [whole, fraction] = formattedNumber.split(".");
  if (!fraction) return whole;
  return `${whole}.${fraction.slice(0, 3)}`;
}
