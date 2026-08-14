export interface Provider {
  id: string;

  provider_code: string;
  provider_name: string;
  provider_type: string;

  specialty: string | null;
  license_number: string | null;
  network_status: string;

  email: string | null;
  phone: string | null;

  city: string | null;
  region: string | null;
  country: string;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}