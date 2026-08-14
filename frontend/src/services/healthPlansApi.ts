import api from "./api";

import type { HealthPlan } from "../types/healthPlan";


const HEALTH_PLANS_PATH = "/health-plans";


export async function getHealthPlans(): Promise<
  HealthPlan[]
> {
  const response = await api.get<HealthPlan[]>(
    HEALTH_PLANS_PATH,
    {
      params: {
        skip: 0,
        limit: 500,
      },
    },
  );

  return response.data;
}


export async function getHealthPlan(
  planId: string,
): Promise<HealthPlan> {
  const response = await api.get<HealthPlan>(
    `${HEALTH_PLANS_PATH}/${encodeURIComponent(
      planId,
    )}`,
  );

  return response.data;
}