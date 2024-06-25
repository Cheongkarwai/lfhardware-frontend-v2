import {Injectable} from "@angular/core";

@Injectable({
  providedIn:'root'
})
export class OtpService{

  private otpSecret: string = '';
  private otpValue: string = '';
  private steps:string[] = ['qr-code', 'verify-code','complete-setup'];
  private currentStep = 0;

  constructor() {
  }

  set secret(secretVal: string){
    this.otpSecret = secretVal;
  }

  get secretVal(){
    return this.otpSecret;
  }

  set otp(otpVal: string){
    this.otpValue = otpVal;
  }

  get otpVal(){
    return this.otpValue;
  }

  // set step(stepVal: string){
  //   this.currentStep = stepVal;
  // }
  //
  nextStep(){
    this.currentStep = ++this.currentStep;
  }

  get stepVal(){
    return this.steps[this.currentStep];
  }
}
