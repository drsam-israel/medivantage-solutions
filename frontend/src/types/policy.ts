export interface Policy {
  id: string;

  policy_number: string;

  policyholder_member_id: string;
  health_plan_id: string;

  status: string;
  policy_type: string;

  effective_date: string;
  expiry_date: string;

  network_name: string | null;

  annual_limit: string;
  deductible_amount: string;
  copay_amount: string;
  coinsurance_percentage: string;
  out_of_pocket_maximum: string;

  premium_amount: string;
  premium_currency: string;

  billing_frequency: string;
  billing_status: string;

  next_payment_date: string | null;

  benefits_summary: string | null;
  exclusions_summary: string | null;

  renewal_eligible: boolean;
  renewal_due_date: string | null;

  cancellation_reason: string | null;
  suspension_reason: string | null;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}


export interface PolicyCreate {
  policy_number: string;

  policyholder_member_id: string;
  health_plan_id: string;

  status?: string;
  policy_type?: string;

  effective_date: string;
  expiry_date: string;

  network_name?: string | null;

  annual_limit?: number;
  deductible_amount?: number;
  copay_amount?: number;
  coinsurance_percentage?: number;
  out_of_pocket_maximum?: number;

  premium_amount?: number;
  premium_currency?: string;

  billing_frequency?: string;
  billing_status?: string;

  next_payment_date?: string | null;

  benefits_summary?: string | null;
  exclusions_summary?: string | null;

  renewal_eligible?: boolean;
  renewal_due_date?: string | null;

  cancellation_reason?: string | null;
  suspension_reason?: string | null;

  is_active?: boolean;
}


export interface PolicyUpdate {
  status?: string | null;
  policy_type?: string | null;

  effective_date?: string | null;
  expiry_date?: string | null;

  network_name?: string | null;

  annual_limit?: number | null;
  deductible_amount?: number | null;
  copay_amount?: number | null;
  coinsurance_percentage?: number | null;
  out_of_pocket_maximum?: number | null;

  premium_amount?: number | null;
  premium_currency?: string | null;

  billing_frequency?: string | null;
  billing_status?: string | null;

  next_payment_date?: string | null;

  benefits_summary?: string | null;
  exclusions_summary?: string | null;

  renewal_eligible?: boolean | null;
  renewal_due_date?: string | null;

  cancellation_reason?: string | null;
  suspension_reason?: string | null;

  is_active?: boolean | null;
}