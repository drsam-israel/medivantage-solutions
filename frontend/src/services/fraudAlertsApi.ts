import api from "./api";

import type {
  FraudAlert,
} from "../types/fraud";


export async function getFraudAlerts(
  fraudCaseId?: string,
): Promise<FraudAlert[]> {
  const response = await api.get<FraudAlert[]>(
    "/fraud-alerts",
    {
      params: {
        skip: 0,
        limit: 500,
        fraud_case_id: fraudCaseId,
      },
    },
  );

  return response.data;
}


export async function getFraudAlert(
  alertId: string,
): Promise<FraudAlert> {
  const response = await api.get<FraudAlert>(
    `/fraud-alerts/${alertId}`,
  );

  return response.data;
}