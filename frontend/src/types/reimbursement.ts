export interface Reimbursement {
  id: string;

  reimbursement_number: string;

  claim_id: string;
  provider_id: string;
  member_id: string | null;

  reimbursement_type: string;
  currency: string;

  billed_amount: number;
  approved_amount: number;
  withholding_amount: number;
  recovery_amount: number;
  net_payable_amount: number;

  status: string;
  approval_status: string;

  approved_by: string | null;
  approved_at: string | null;
  approval_notes: string | null;

  payment_method: string | null;
  scheduled_payment_date: string | null;
  payment_reference: string | null;
  paid_at: string | null;

  reconciliation_status: string;
  reconciliation_reference: string | null;
  reconciled_by: string | null;
  reconciled_at: string | null;

  ai_risk_score: number | null;
  ai_risk_level: string | null;
  ai_risk_reason: string | null;

  created_at: string;
  updated_at: string;
}

export interface ReimbursementApprovalRequest {
  approved_by: string;
  approval_notes?: string | null;
}

export interface ReimbursementPaymentRequest {
  payment_method: string;
  payment_reference: string;
}

export interface ReimbursementReconciliationRequest {
  reconciliation_status: string;
  reconciliation_reference: string;
  reconciled_by: string;
  notes?: string | null;
}