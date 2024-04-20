import {Component, OnDestroy, OnInit} from '@angular/core';
import {TuiStepperModule} from "@taiga-ui/kit";
import {ActivatedRoute, ActivationEnd, NavigationEnd, Router, RouterModule, RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {filter, Observable, Subject, takeUntil} from "rxjs";
import {ServiceProviderSignupService} from "../../core/service-provider/service-provider-signup.service";
import {SuccessPageComponent} from "../success-page/success-page.component";

@Component({
  selector: 'app-service-provider-signup',
  standalone: true,
  imports: [
    CommonModule,
    TuiStepperModule,
    RouterModule,
    SuccessPageComponent
  ],
  templateUrl: './service-provider-signup.component.html',
  styleUrl: './service-provider-signup.component.scss'
})
export class ServiceProviderSignupComponent implements OnInit, OnDestroy{

  steppers:any[] = [];
  activeIndex = 0;
  stepsState: any[]=['normal','normal','normal','normal'];

  formSubmitted$!: Observable<boolean>;

  destroy$ = new Subject<boolean>();
  constructor(private router:Router,private activatedRoute:ActivatedRoute,private serviceProviderSignupService:ServiceProviderSignupService) {
    this.steppers = this.router.config.filter(route=>route.path === 'service-provider-signup')
      .flatMap(parentRoute=>parentRoute.children).filter(route=>route?.path !== '');

    this.serviceProviderSignupService.basicInforFormValid.pipe(takeUntil(this.destroy$)).subscribe(res=>{
      if(res){
        this.stepsState[0] = 'pass';
      }else{
        this.stepsState[0] = 'error';
      }
    });

    this.serviceProviderSignupService.documentCredentialsFormValid.pipe(takeUntil(this.destroy$)).subscribe(res=>{
      if(res){
        this.stepsState[1] = 'pass';
      }else{
        this.stepsState[1] = 'error';
      }
    })

    this.serviceProviderSignupService.bankingDetailsFormValid.pipe(takeUntil(this.destroy$)).subscribe(res=>{
      if(res){
        this.stepsState[2] = 'pass';
      }else{
        this.stepsState[2] = 'error';
      }
    });

    this.serviceProviderSignupService.albumsFormValid.pipe(takeUntil(this.destroy$)).subscribe(res=>{
      if(res){
        this.stepsState[3] = 'pass';
      }else{
        this.stepsState[3] = 'error';
      }
    });

    this.serviceProviderSignupService.currentIndexObs.pipe(takeUntil(this.destroy$)).subscribe(res=>{
      this.activeIndex = res;
    });
  }

  ngOnInit() {
    this.formSubmitted$ = this.serviceProviderSignupService.formSubmitState;
  }

  switchIndex(index: number) {
    this.activeIndex = index;
  }


  goNext() {
    if(this.steppers.length -1  > this.activeIndex){
      this.activeIndex++;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
