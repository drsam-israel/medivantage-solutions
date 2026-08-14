export interface HealthPlan {
  id: string;

  plan_code: string;
  plan_name: string;
  plan_type: string;
  coverage_level: string;

  annual_deductible: string;
  out_of_pocket_maximum: string;
  monthly_premium: string;
  coinsurance_percentage: string;

  primary_care_copay: string;
  specialist_copay: string;

  effective_date: string;
  expiration_date: string | null;

  currency: string;
  is_active: boolean;

  created_at: string;
  updated_at: string;
}