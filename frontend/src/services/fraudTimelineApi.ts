import api from "./api";

import type {
  FraudTimelineEvent,
} from "../types/fraud";


export async function getFraudTimelineEvents(
  fraudCaseId?: string,
): Promise<FraudTimelineEvent[]> {
  const response = await api.get<
    FraudTimelineEvent[]
  >(
    "/fraud-timeline-events",
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