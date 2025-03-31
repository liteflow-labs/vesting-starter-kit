"use client";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { generateChartData, STEPS } from "@/lib/graph";
import {
  GetVestingsByChainIdByAddressPositionsByUserAddressResponse,
  GetVestingsResponse,
} from "@liteflow/sdk/dist/client";
import { format, formatDate } from "date-fns";
import { useMemo } from "react";
import { Area, AreaChart, ReferenceLine, Tooltip, XAxis } from "recharts";

export default function VestingGraph({
  vesting,
  position,
}: {
  vesting: GetVestingsResponse["data"][number];
  position:
    | GetVestingsByChainIdByAddressPositionsByUserAddressResponse
    | undefined;
}) {
  const chartData = useMemo(
    () => generateChartData(vesting, position),
    [vesting, position]
  );

  const isOverlapping = useMemo(() => {
    const overlapLimit = 100;
    const timeStep =
      (vesting.endDate.getTime() - vesting.startDate.getTime()) / (STEPS - 1);
    return (
      Math.abs(new Date().getTime() - vesting.cliffDate.getTime()) / timeStep <
      overlapLimit
    );
  }, [vesting]);

  return (
    <ChartContainer config={{}}>
      <AreaChart data={chartData} margin={{ top: 10 }}>
        <defs>
          <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          type="number"
          domain={["dataMin", "dataMax"]}
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */
          tickFormatter={(tick) => format(new Date(tick), "MMM yyyy")}
          minTickGap={40}
          axisLine={false}
        />
        <Tooltip
          content={
            <ChartTooltipContent
              indicator="line"
              /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
              labelFormatter={(_label, [{ payload }]: any) => {
                /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
                return formatDate(payload.date, "dd MMM yyyy");
              }}
            />
          }
        />

        <ReferenceLine
          x={new Date().getTime()}
          stroke="hsl(var(--muted-foreground))"
          strokeDasharray="3 3"
          label={{
            value: "Today",
            position: "insideTopLeft",
            fill: "hsl(var(--muted-forground))",
            dy: isOverlapping ? 16 : 0,
          }}
        />

        <ReferenceLine
          x={vesting.cliffDate.getTime()}
          stroke="hsl(var(--destructive))"
          strokeDasharray="3 3"
          label={{
            value: "Cliff date",
            position: "insideTopLeft",
            fill: "hsl(var(--destructive))",
          }}
        />

        <Area type="linear" dataKey="value" fill="url(#tokenGradient)" />
      </AreaChart>
    </ChartContainer>
  );
}
