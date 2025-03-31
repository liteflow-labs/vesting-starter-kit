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
  const formatter = Intl.NumberFormat("en-US");
  return (
    <span title={formattedNumber}>
      {formatter.format(Number(formattedNumber))}
    </span>
  );
}
