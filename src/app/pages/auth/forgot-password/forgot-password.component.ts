import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {UserService} from "../../../core/user/user.service";
import {AlertService} from "../../../core/service/alert.service";
import {map, Observable, takeWhile, tap, timer} from "rxjs";
import {MillisecondToMinuteSecondPipe} from "../../../core/pipe/millisecond-to-minute-second.pipe";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MillisecondToMinuteSecondPipe],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  emailControl:FormControl<string | null>;
  resend:boolean = true;
  $timer:Observable<any> = new Observable<any>();

  constructor(private userService: UserService, private alertService: AlertService) {
    this.emailControl = new FormControl('', [Validators.required, Validators.pattern('\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*')]);
  }

  sendResetPasswordEmail() {
    if(this.emailControl.valid) {
      this.userService.recoverAccount(this.emailControl.getRawValue())
        .subscribe({
          next:res=>{
            this.alertService.showSuccess(`A password reset email has been sent to ${this.emailControl.value}`);
            this.resend = false;
            this.$timer = timer(0, 1000).pipe(
              map(n => (120 - n)),
              takeWhile(n => n >= 0),
              tap(null, null, () => this.resend = true)
            );
          },
          error:err=> this.alertService.showError('Something went wrong, please try again later.')
        });
    }
  }
}
