"use client";

import { Progress } from "@/components/ui/progress";
import { GetVestingsResponse } from "@liteflow/sdk/dist/client";
import { useMemo } from "react";

type Props = {
  vesting: GetVestingsResponse["data"][number];
};

export default function VestingProgress({ vesting }: Props) {
  const progress = useMemo(() => {
    if (!vesting) return 0;
    const currentDate = new Date();
    return Math.min(
      100,
      Math.max(
        0,
        ((currentDate.getTime() - vesting.startDate.getTime()) /
          (vesting.endDate.getTime() - vesting.startDate.getTime())) *
          100
      )
    );
  }, [vesting]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Vesting Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
