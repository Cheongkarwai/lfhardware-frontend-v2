import {Component, OnInit} from '@angular/core';
import {
  TUI_VALIDATION_ERRORS,
  TuiComboBoxModule,
  TuiDataListWrapperModule, TuiFieldErrorPipeModule, TuiFilterByInputPipeModule,
  TuiInputModule,
  TuiInputPasswordModule,
  TuiStringifyContentPipeModule
} from "@taiga-ui/kit";
import {TuiErrorModule, TuiLabelModule, TuiTextfieldControllerModule, TuiTooltipModule} from "@taiga-ui/core";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {ServiceProviderSignupService} from "../../../core/service-provider/service-provider-signup.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertService} from "../../../core/service/alert.service";

@Component({
  selector: 'app-banking-details',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiInputPasswordModule,
    TuiLabelModule,
    TuiTextfieldControllerModule,
    TuiTooltipModule,
    CommonModule,
    RouterModule,
    TuiComboBoxModule,
    TuiDataListWrapperModule,
    TuiStringifyContentPipeModule,
    TuiFilterByInputPipeModule,
    ReactiveFormsModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
  ],
  providers:[
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'Required',
        email: 'Enter a valid email',
        maxlength: ({requiredLength}: { requiredLength: string }) =>
          `Maximum length — ${requiredLength}`,
      },
    }
  ],
  templateUrl: './banking-details.component.html',
  styleUrl: './banking-details.component.scss'
})
export class BankingDetailsComponent implements OnInit {

  currentIndex = 0;
  routes :any[]= [];

  bankAccountForm!:FormGroup;
  constructor(private router:Router,private activatedRoute:ActivatedRoute, private fb:FormBuilder,private serviceProviderSignupFormService:ServiceProviderSignupService,
              private alertService:AlertService) {
    this.currentIndex = activatedRoute.snapshot.data?.['index'];
    this.routes = this.router.config.filter(route=>route.path === 'service-provider-signup')
      .flatMap(parentRoute=>parentRoute.children).filter(route=>route?.path !== '');
    this.setActiveIndex(this.currentIndex);
  }

  ngOnInit() {
    this.bankAccountForm = this.fb.group({
      bank:['',Validators.required],
      full_name:['',Validators.required],
      account_number:['',[Validators.required]],
    });
  }

  setActiveIndex(index:number){
    this.serviceProviderSignupFormService.setCurrentIndex(index);
  }

  submitBankingDetails() {
    //this.setActiveIndex(this.currentIndex + 1);
    if(this.bankAccountForm.invalid){
      this.alertService.showError(`Please fill in the required field before proceed.`);
      this.bankAccountForm.markAllAsTouched();
    }else{
      this.serviceProviderSignupFormService.setBankingDetailsFormValid(true);
      this.router.navigate([`../${this.routes[this.currentIndex+1].path}`],{relativeTo:this.activatedRoute})
        .then(res=>{
          if(res){
            this.serviceProviderSignupFormService.setBankingDetailsFormData(this.bankAccountForm.getRawValue());
          }
        });
    }
    console.log(this.bankAccountForm.getRawValue());
  }

  readonly banks = [
    'Public Bank'
  ];

}
