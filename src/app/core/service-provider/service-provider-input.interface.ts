import {ContactInfo} from "./service-provider-signup.service";
import {Service} from "./service.interface";
import {ServiceProviderReview} from "./service-provider-details";
import {State} from "../state/state.interface";
import {City} from "../city/city.interface";
import {Country} from "../country/country.interface";

export interface ServiceProviderInput{
  id: number;
  name: string;
  is_verified: boolean;
  contact_info: ContactInfo
  services: Service[];
  overview: string;
  coverage: {
    state_coverages: State[],
    country_coverages: Country[],
    city_coverages: City[]
  }
  // business_profile_image: string;
  // social_media: {
  //   facebook: string;
  //   instagram: string;
  //   tiktok: string;
  // },
  // front_identity_card: string;
  // back_identity_card: string;
  // ssm: string;
}
