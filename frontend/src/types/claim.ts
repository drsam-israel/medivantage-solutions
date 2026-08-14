export interface Claim {
  id: string;
  claim_number: string;

  member_id: string;
  provider_id: string;
  enrollment_id: string;

  service_date: string;
  submission_date: string;

  claim_type: string;

  diagnosis_code: string | null;
  procedure_code: string | null;

  billed_amount: string;
  allowed_amount: string | null;

  deductible_amount: string;
  copay_amount: string;
  coinsurance_amount: string;

  payer_responsibility: string | null;
  member_responsibility: string | null;

  claim_status:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "PARTIALLY_APPROVED"
    | "DENIED"
    | "PAID"
    | "CANCELLED";

  denial_reason: string | null;
  adjudication_notes: string | null;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}