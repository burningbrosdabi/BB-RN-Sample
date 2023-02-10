export interface IRecipient {
  id: number;
  contact_number: string;
  recipient_name: string;
  country: string;
  additional_address: string;
  primary: boolean;
  ward: string;
  district: string;
  province: string;
  ward_id: number;
  district_id: number;
  province_id: number;
}
