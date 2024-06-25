import {ContactInfo} from "./service-provider-signup.service";

export interface ServiceProvider {
  id: string;
  name: string;
  is_verified: boolean;
  contact_info: ContactInfo
  rating: number;
  status: string;
  front_identity_card: string;
  back_identity_card: string;
  ssm: string;
  stripe_account_id: string;
  business_profile_image: string;
}
