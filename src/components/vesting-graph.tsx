"use client";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  GetVestingsByChainIdByAddressPositionsByUserAddressResponse,
  GetVestingsResponse,
} from "@liteflow/sdk/dist/client";
import { format, formatDate } from "date-fns";
import { useMemo } from "react";
import { Area, AreaChart, Tooltip, XAxis } from "recharts";

const generateChartData = (
  vesting: GetVestingsResponse["data"][number],
  position:
    | GetVestingsByChainIdByAddressPositionsByUserAddressResponse
    | undefined
) => {
  const startTime = vesting.startDate.getTime();
  const endTime = vesting.endDate.getTime();
  const cliffTime = vesting.cliffDate.getTime();
  const totalAllocation = BigInt(position?.totalAllocation ?? 0);
  const decimals = BigInt(vesting.token.decimals);

  const cliffAmount =
    (totalAllocation * BigInt(vesting.cliffReleasePercentageBps)) /
    BigInt(10000);
  const remainingAmount = totalAllocation - cliffAmount;

  const data = [];
  const STEPS = 1000;
  const BUFFER_STEPS = 50;
  const timeStep = (endTime - startTime) / (STEPS - 1);

  // Add buffer before vesting starts
  for (let i = 0; i < BUFFER_STEPS; i++) {
    const time = Math.floor(startTime - timeStep * (BUFFER_STEPS - i));
    data.push({ date: time, value: 0 });
  }

  // Add vesting period
  for (let i = 0; i < STEPS; i++) {
    const time = Math.floor(startTime + timeStep * i);
    let tokens = BigInt(0);

    if (time === cliffTime) tokens = cliffAmount;

    if (time > cliffTime) {
      const timeAfterCliff = time - cliffTime;
      const totalVestingTime = endTime - cliffTime;
      const progress = Number(timeAfterCliff) / Number(totalVestingTime);
      tokens =
        cliffAmount +
        (remainingAmount * BigInt(Math.floor(progress * 10000))) /
          BigInt(10000);
    }

    data.push({
      date: time,
      value: Number(tokens / BigInt(10) ** decimals),
    });
  }

  // Add buffer after vesting ends
  for (let i = 0; i < BUFFER_STEPS; i++) {
    const time = Math.floor(endTime + timeStep * i);
    data.push({
      date: time,
      value: Number(totalAllocation / BigInt(10) ** decimals),
    });
  }

  return data;
};

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
        <Area type="linear" dataKey="value" fill="url(#tokenGradient)" />

        {/* <ReferenceLine
          x={vesting.startDate.getTime()}
          stroke="hsl(var(--muted))"
          strokeDasharray="3 3"
          label={{
            value: "Start",
            position: "insideTopLeft",
            fill: "hsl(var(--muted))",
          }}
        />

        <ReferenceLine
          x={vesting.endDate.getTime()}
          stroke="hsl(var(--muted))"
          strokeDasharray="3 3"
          label={{
            value: "End",
            position: "insideTopLeft",
            fill: "hsl(var(--muted))",
          }}
        />

        <ReferenceLine
          x={vesting.cliffDate.getTime()}
          stroke="hsl(var(--destructive))"
          strokeDasharray="3 3"
          // ifOverflow="visible"
          label={{
            value: "Cliff date",
            position: "insideTopLeft",
            fill: "hsl(var(--destructive))",
          }}
        /> */}
      </AreaChart>
    </ChartContainer>
  );
}
