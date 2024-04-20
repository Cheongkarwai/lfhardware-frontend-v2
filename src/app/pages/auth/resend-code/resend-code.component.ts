import {Component, Inject, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {
  TuiAlertModule,
  TuiAlertService,
  TuiErrorModule,
  TuiLabelModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {AlertService} from "../../../core/service/alert.service";
import {async, map, Observable, takeWhile, tap, timer} from "rxjs";
import {CommonModule} from "@angular/common";
import {MillisecondToMinuteSecondPipe} from "../../../core/pipe/millisecond-to-minute-second.pipe";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiFieldErrorPipeModule, TuiInputModule} from "@taiga-ui/kit";

@Component({
  selector: 'app-resend-code',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MillisecondToMinuteSecondPipe,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiLabelModule,
  ],
  templateUrl: './resend-code.component.html',
  styleUrl: './resend-code.component.scss'
})
export class ResendCodeComponent implements OnInit{

   $timer: Observable<any> = new Observable<any>();
   resend = false;
   isSent = false;

   otpForm!:FormGroup;
  constructor(private alertService:AlertService,private fb:FormBuilder) {
  }
  ngOnInit() {
     this.otpForm = this.fb.group({
       email_address:[{disabled:false,value:''},Validators.required],
       otp:[{disabled:true,value:''},[Validators.required,Validators.min(6),Validators.min(6)]]
     })
  }

  sendCode() {
    console.log(this.otpForm.invalid);
    if(!this.otpForm.invalid){
      this.isSent = true;
      this.otpForm.controls['otp'].enable();
      this.resend = false;
      this.alertService.showInfo(`OTP Code has been sent to your email address`)
      this.$timer = timer(0, 1000).pipe(
        map(n => (120 - n)),
        takeWhile(n => n >= 0),
        tap(null, null, () => this.resend = true)
      );
    }else{
      this.alertService.showError('Email address is invalid');
      this.otpForm.controls['email_address'].markAsTouched();
      this.otpForm.controls['email_address'].markAsDirty();
    }
  }

  verifyCode() {
    this.alertService.showSuccess('You have been verified');
    this.alertService.showError('Invalid OTP');
  }
}
