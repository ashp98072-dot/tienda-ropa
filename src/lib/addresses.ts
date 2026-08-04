export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  department: string;
  municipality: string;
  address: string;
  notes: string;
  is_default: boolean;
  created_at: string;
}

export type AddressInput = Omit<
  Address,
  "id" | "user_id" | "created_at"
>;
