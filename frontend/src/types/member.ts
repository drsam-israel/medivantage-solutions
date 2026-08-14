export interface Member {
  id: string;
  member_number: string;
  national_id: string | null;

  first_name: string;
  middle_name: string | null;
  last_name: string;

  date_of_birth: string;
  gender: string;

  email: string | null;
  phone: string | null;

  city: string | null;
  region: string | null;
  country: string;

  enrollment_status: string;
  is_active: boolean;

  created_at: string;
  updated_at: string;
}