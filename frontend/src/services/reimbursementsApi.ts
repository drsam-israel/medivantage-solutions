import api from "./api";

import type {
  Reimbursement,
  ReimbursementApprovalRequest,
  ReimbursementPaymentRequest,
  ReimbursementReconciliationRequest,
} from "../types/reimbursement";

export async function getReimbursements(): Promise<
  Reimbursement[]
> {
  const response = await api.get<Reimbursement[]>(
    "/reimbursements",
    {
      params: {
        skip: 0,
        limit: 500,
      },
    },
  );

  return response.data;
}

export async function getReimbursement(
  reimbursementId: string,
): Promise<Reimbursement> {
  const response = await api.get<Reimbursement>(
    `/reimbursements/${reimbursementId}`,
  );

  return response.data;
}

export async function approveReimbursement(
  reimbursementId: string,
  payload: ReimbursementApprovalRequest,
): Promise<Reimbursement> {
  const response = await api.post<Reimbursement>(
    `/reimbursements/${reimbursementId}/approve`,
    payload,
  );

  return response.data;
}

export async function payReimbursement(
  reimbursementId: string,
  payload: ReimbursementPaymentRequest,
): Promise<Reimbursement> {
  const response = await api.post<Reimbursement>(
    `/reimbursements/${reimbursementId}/pay`,
    payload,
  );

  return response.data;
}

export async function reconcileReimbursement(
  reimbursementId: string,
  payload: ReimbursementReconciliationRequest,
): Promise<Reimbursement> {
  const response = await api.post<Reimbursement>(
    `/reimbursements/${reimbursementId}/reconcile`,
    payload,
  );

  return response.data;
}