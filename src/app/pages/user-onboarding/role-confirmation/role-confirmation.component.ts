import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {initFlowbite} from "flowbite";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {AccountService} from "../../../core/user/account.service";
import {UserService} from "../../../core/user/user.service";

@Component({
  selector: 'app-role-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './role-confirmation.component.html',
  styleUrl: './role-confirmation.component.scss'
})
export class RoleConfirmationComponent implements OnInit {

  role: FormControl<string | null> = new FormControl<string | null>('CUSTOMER');

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private userService: UserService) {
  }

  ngOnInit() {
    initFlowbite();
    this.userService.findAllCurrentUserRoles().subscribe({
      next:roles=> {
        const roleNames = roles.map(role=>role.name);
        if(roleNames.includes('service_provider')){
          this.role.setValue('SERVICE PROVIDER');
        }else if(roleNames.includes("customer")){
          this.role.setValue('CUSTOMER');
        }
        this.openOnboardingForm();
      }
    })
  }

  @Output()
  step: EventEmitter<string> = new EventEmitter<string>();

  changeStep(step: string) {
    this.step.emit(step);
  }

  openOnboardingForm() {
    switch (this.role.getRawValue()) {
      case 'SERVICE PROVIDER':
        this.router.navigate(['user-onboarding/service-provider'])
        break;

      case 'CUSTOMER':
        this.router.navigate(['user-onboarding/customer'])
        break;
    }
  }
}
