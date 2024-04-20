import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {UserAccount} from "../user/user-account.interface";
import {ServiceProviderAccount} from "./service-provider-account.interface";
import {Service} from "./service.interface";

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderSignupService {

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

  setBasicInfoFormData(basicInfo:BasicInfoForm){
    this.basicInfoFormData$.next(basicInfo);
  }

  setDocumentAndCredentialsFormData(documentAndCredentialsForm:DocumentAndCredentialsForm){
    this.documentAndCredentialsFormData$.next(documentAndCredentialsForm);
  }

  setBankingDetailsFormData(value:BankingDetailsForm) {
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

  get basicInfoFormData(){
    return this.basicInfoFormData$;
  }

  get documentAndCredentialsFormData(){
    return this.documentAndCredentialsFormData$;
  }

  get bankDetailsFormData(){
    return this.bankDetailsFormData$;
  }
  register(account:ServiceProviderAccount) {
    return this.httpClient.post(`${environment.api_url}/users/roles/service-provider`, account);
  }

}

export interface BasicInfoForm{
  business_details:BusinessDetails;
  service_details:ServiceDetails;
}

export interface BusinessDetails{
  name:string,
  email_address:string,
  description:string;
  address:string;
}

export interface ServiceDetails{
  type_of_services:Service[],
  contact_info:ContactInfo,
  description:string;
  address:string;
  coverage:Coverage;
}

export interface BankingDetailsForm{
  full_name:string;
  bank:string;
  account_number:string;
}

export interface ContactInfo{
  email_address:string;
  phone_number:string;
  whatsapp:string;
}

export interface Coverage{
  countries:string[],
  states:string[],
  cities:string[]
}

export interface DocumentAndCredentialsForm{
  personal_identification:File[];
  awards:File[],
  customer_testimonials:File[],
  social_media_link:SocialMediaLink
}

export interface SocialMediaLink{
  facebook:string;
  instagram:string;
  tiktok:string;
}
