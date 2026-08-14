export interface Enrollment {
  id: string;

  member_id: string;
  health_plan_id: string;

  policy_number: string;
  enrollment_type: string;
  relationship_to_subscriber: string;

  subscriber_member_id: string | null;

  group_number: string | null;
  employer_name: string | null;

  coverage_start_date: string;
  coverage_end_date: string | null;

  enrollment_status: string;
  termination_reason: string | null;

  is_primary: boolean;
  is_active: boolean;

  created_at: string;
  updated_at: string;
}