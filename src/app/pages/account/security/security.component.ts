import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {DialogModule} from "@angular/cdk/dialog";
import {MatDialog} from "@angular/material/dialog";
import {AccountService} from "../../../core/user/account.service";
import {map, Observable} from "rxjs";
import {UserCredential} from "../../../core/user/user-credential.interface";
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule
  ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss'
})
export class SecurityComponent implements OnInit, AfterViewInit{

  credentials$ !: Observable<UserCredential[]>;
  isOtpEnabled: boolean = false;

  constructor(private matDialog: MatDialog,
              private accountService: AccountService) {
  }

  ngOnInit() {
    this.credentials$ = this.accountService.findAllCredentials()
      .pipe(map(credentials=> {
        for(let credential of credentials){
          if(credential.label === 'otp'){
            this.isOtpEnabled = true;
            break;
          }
        }
        return credentials;
      }));
  }

  ngAfterViewInit() {
    initFlowbite();
  }

  selectTwoFactorAuthenticationMethod(otpAuthenticatorApp: string) {
    // switch (otpAuthenticatorApp) {
    //   case 'otp-authenticator-app':
    //     this.matDialog.open(OtpViaAuthenticatorAppComponent);
    //     break;
    // }
  }
}
