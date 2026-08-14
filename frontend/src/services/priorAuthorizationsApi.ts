import api from "./api";

import type {
  PriorAuthorization,
  PriorAuthorizationDecisionRequest,
} from "../types/priorAuthorization";

const PRIOR_AUTHORIZATIONS_PATH = "/prior-authorizations";

export async function getPriorAuthorizations(): Promise<
  PriorAuthorization[]
> {
  const response = await api.get<PriorAuthorization[]>(
    PRIOR_AUTHORIZATIONS_PATH,
  );

  return response.data;
}

export async function getPriorAuthorization(
  authorizationId: string,
): Promise<PriorAuthorization> {
  const response = await api.get<PriorAuthorization>(
    `${PRIOR_AUTHORIZATIONS_PATH}/${authorizationId}`,
  );

  return response.data;
}

export async function submitPriorAuthorizationDecision(
  authorizationId: string,
  decision: PriorAuthorizationDecisionRequest,
): Promise<PriorAuthorization> {
  const response = await api.post<PriorAuthorization>(
    `${PRIOR_AUTHORIZATIONS_PATH}/${authorizationId}/decision`,
    decision,
  );

  return response.data;
}