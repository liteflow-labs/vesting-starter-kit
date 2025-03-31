import {
  GetVestingsByChainIdByAddressPositionsByUserAddressResponse,
  GetVestingsResponse,
} from "@liteflow/sdk/dist/client";

export const STEPS = 1000;
export const BUFFER_STEPS = 50;

export function generateChartData(
  vesting: GetVestingsResponse["data"][number],
  position:
    | GetVestingsByChainIdByAddressPositionsByUserAddressResponse
    | undefined
) {
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

  data.push({
    date: cliffTime,
    value: Number(cliffAmount / BigInt(10) ** decimals),
  });

  return data.sort((a, b) => a.date - b.date);
}
