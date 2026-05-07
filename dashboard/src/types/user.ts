export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  locale: string;
  identity_verification_id: string | null;
  identity_verification_source: string | null;
  created_at: string;
  updated_at: string;
};