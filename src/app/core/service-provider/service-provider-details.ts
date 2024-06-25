import {ContactInfo} from "./service-provider-signup.service";
import {Service} from "./service.interface";
import {ServiceProvider} from "./service-provider.interface";
import {Review} from "../review/review.interface";
import {Customer} from "../customer/customer.interface";

export interface ServiceProviderDetails {
  id: string;
  name: string;
  is_verified: boolean;
  contact_info: ContactInfo
  rating: number;
  services: Service[];
  overview: string;
  state_coverages: string[],
  country_coverages: string[],
  city_coverages: string[]
  status: string;
  created_at: Date;
  business_profile_image: string;
  reviews: ServiceProviderReview[];
  social_media: {
    facebook: string;
    instagram: string;
    tiktok: string;
  },
  front_identity_card: string;
  back_identity_card: string;
  ssm: string;
}

export interface ServiceProviderReview extends Review {
  service_provider: ServiceProvider;
  customer: Customer
}

