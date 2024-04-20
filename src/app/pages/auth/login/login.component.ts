import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons/faEnvelope";
import {Auth,} from "@angular/fire/auth";
import {browserSessionPersistence, setPersistence} from 'firebase/auth';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AlertService} from "../../../core/service/alert.service";
import {LoginService} from "../../../core/user/login.service";
import {UserService} from "../../../core/user/user.service";
import {ButtonComponent} from "../../../components/button/button.component";
import {ToastService} from "../../../core/dialog/toast.service";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FaIconComponent,
    ReactiveFormsModule,
    CommonModule,
    ButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  faMail = faEnvelope;
  faGoogle = faGoogle;

  private auth = inject(Auth);

  loginForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder,
              private loginService: LoginService, private userService: UserService,
              private toastService: ToastService) {
    this.loginForm = this.fb.group({
      email_address: ['', [Validators.required], []],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

  }

  async login() {

    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      await setPersistence(this.auth, browserSessionPersistence);
      const loginResult = await this.loginService.login(this.loginForm.controls['email_address'].getRawValue(), this.loginForm.controls['password'].getRawValue())
        .catch(err => this.toastService.open(err.message, 'error'));

      if (loginResult) {
        this.router.navigate(['']).then(res => {
          this.toastService.open('Welcome back', 'success');
        });
      }
    } else {
      this.toastService.open('Please fill in the required fields', 'error');
    }

  }

  async loginWithProviders(provider: string) {
    await setPersistence(this.auth, browserSessionPersistence);
    const loginResult = await this.loginService.loginWithServiceProvider(provider);


    if (loginResult) {
      this.router.navigate(['']).then(res => {
        this.toastService.open('Welcome back', 'success');
      });
    } else {
      this.toastService.open('Please login again', 'error');
    }
  }

  get emailAddressControl() {
    return this.loginForm.controls['email_address'];
  }

  get passwordControl() {
    return this.loginForm.controls['password'];
  }

}


