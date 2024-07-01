import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {UserAccount} from "../user/user-account.interface";
import {ServiceProviderAccount} from "./service-provider-account.interface";
import {Service} from "./service.interface";
import {State} from "../state/state.interface";

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderSignupService {

  steps: string[] = ['Basic Information', 'Documents', 'Payment Details'];
  currentStepIndex: number = 0;

  basicInfo: any = {};

  basicInfoFormValid$ = new BehaviorSubject<boolean>(false);
  documentCredentialsFormValid$ = new BehaviorSubject<boolean>(false);
  bankingDetailsFormValid$ = new BehaviorSubject<boolean>(false);
  albumsFormValid$ = new BehaviorSubject<boolean>(false);

  private currentIndex$ = new BehaviorSubject<number>(0);
  private formSubmitState$ = new BehaviorSubject<boolean>(false);


  private basicInfoFormData$ = new BehaviorSubject<BasicInfoForm | null>(null);
  private documentAndCredentialsFormData$ = new BehaviorSubject<DocumentAndCredentialsForm | null>(null);
  private bankDetailsFormData$ = new BehaviorSubject<BankingDetailsForm | null>(null);

  constructor(private httpClient: HttpClient) {
  }

  nextStep() {
    ++this.currentStepIndex;
  }

  prevStep() {
    --this.currentStepIndex;
  }

  get allSteps() {
    return this.steps;
  }

  get currentStep() {
    return this.steps[this.currentStepIndex];
  }

  setBasicInfoFormValid(value: boolean) {
    this.basicInfoFormValid$.next(value)
  }

  setDocumentCredentialsFormValid(value: boolean) {
    this.documentCredentialsFormValid$.next(value)
  }

  setBankingDetailsFormValid(value: boolean) {
    this.bankingDetailsFormValid$.next(value)
  }

  setAlbumsFormValid(value: boolean) {
    this.albumsFormValid$.next(value)
  }

  setCurrentIndex(index: number) {
    this.currentIndex$.next(index);
  }

  setFormSubmitState(state: boolean) {
    this.formSubmitState$.next(state);
  }

  setBasicInfoFormData(basicInfo: BasicInfoForm) {
    this.basicInfoFormData$.next(basicInfo);
  }

  setDocumentAndCredentialsFormData(documentAndCredentialsForm: DocumentAndCredentialsForm) {
    this.documentAndCredentialsFormData$.next(documentAndCredentialsForm);
  }

  setBankingDetailsFormData(value: BankingDetailsForm) {
    this.bankDetailsFormData$.next(value);
  }

  get currentIndexObs() {
    return this.currentIndex$.asObservable();
  }

  get currentIndex() {
    return this.currentIndex$;
  }

  get basicInforFormValid() {
    return this.basicInfoFormValid$.asObservable();
  }

  get documentCredentialsFormValid() {
    return this.documentCredentialsFormValid$.asObservable();
  }

  get bankingDetailsFormValid() {
    return this.bankingDetailsFormValid$.asObservable();
  }

  get albumsFormValid() {
    return this.albumsFormValid$.asObservable();
  }

  get formSubmitState() {
    return this.formSubmitState$.asObservable();
  }

  get basicInfoFormData() {
    return this.basicInfoFormData$;
  }

  get documentAndCredentialsFormData() {
    return this.documentAndCredentialsFormData$;
  }

  get bankDetailsFormData() {
    return this.bankDetailsFormData$;
  }

  register(account: ServiceProviderAccount) {
    return this.httpClient.post(`${environment.api_url}/users/roles/service-provider`, account);
  }

  getValue() {
    return {
      basic_information: this.basicInfoFormData.value,
      // documents: this.documentAndCredentialsFormData.value
    };
  }

  getDocument() {
    return this.documentAndCredentialsFormData.value;
  }
}

// export interface BasicInfoForm {
//   business_details: BusinessDetails;
//   service_details: ServiceDetails;
// }
//
// export interface BusinessDetails {
//   name: string,
//   email_address: string,
//   description: string;
//   address: string;
// }
//
// export interface ServiceDetails {
//   type_of_services: Service[],
//   contact_info: ContactInfo,
//   description: string;
//   address: string;
//   coverage: Coverage;
// }

export interface BankingDetailsForm {
  full_name: string;
  bank: string;
  account_number: string;
}

export interface ContactInfo {
  email_address: string;
  phone_number: string;
  fax_number: string;
}

export interface Coverage {
  countries: string[],
  states: string[],
  cities: string[]
}

export interface DocumentAndCredentialsForm {
  front_identity_card: File;
  back_identity_card: File;
  ssm: File;
  business_profile_image: File;
}

export interface SocialMediaLink {
  facebook: string;
  instagram: string;
  tiktok: string;
}

export interface BasicInfoForm {
  business_details: {
    address: {
      city: string;
      line_1: string;
      line_2: string;
      state: string;
      zipcode: string;
    };
    email_address: string;
    fax_no: string;
    location: string;
    name: string;
    phone_number: string;
    website: string;
  };
  social_media:{
    facebook: string;
    instagram: string;
    twitter: string;
    whatsapp: string;
  }
  service_details: {
    coverage: {
      value: State;
      selected: boolean;
    };
    type_of_services: Service[]
  }
}
