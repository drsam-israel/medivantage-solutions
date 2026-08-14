import api from "./api";

import type {
  Policy,
  PolicyCreate,
  PolicyUpdate,
} from "../types/policy";


const POLICIES_PATH = "/policies";


export async function getPolicies(): Promise<
  Policy[]
> {
  const response = await api.get<Policy[]>(
    POLICIES_PATH,
    {
      params: {
        skip: 0,
        limit: 500,
      },
    },
  );

  return response.data;
}


export async function getPolicy(
  policyId: string,
): Promise<Policy> {
  const response = await api.get<Policy>(
    `${POLICIES_PATH}/${encodeURIComponent(
      policyId,
    )}`,
  );

  return response.data;
}


export async function getPolicyByNumber(
  policyNumber: string,
): Promise<Policy> {
  const response = await api.get<Policy>(
    `${POLICIES_PATH}/number/${encodeURIComponent(
      policyNumber,
    )}`,
  );

  return response.data;
}


export async function createPolicy(
  payload: PolicyCreate,
): Promise<Policy> {
  const response = await api.post<Policy>(
    POLICIES_PATH,
    payload,
  );

  return response.data;
}


export async function updatePolicy(
  policyId: string,
  payload: PolicyUpdate,
): Promise<Policy> {
  const response = await api.put<Policy>(
    `${POLICIES_PATH}/${encodeURIComponent(
      policyId,
    )}`,
    payload,
  );

  return response.data;
}