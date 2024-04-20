import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER } from "@taiga-ui/core";
import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import {AfterViewInit, Component, Inject, inject, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Route, Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from "./fragment/navbar/navbar.component";
import {SidebarComponent} from "./fragment/sidebar/sidebar.component";
import {FooterComponent} from "./fragment/footer/footer.component";
import {Auth} from "@angular/fire/auth";
import {NgIf} from "@angular/common";
import {injectStripe, StripeElementsDirective, StripePaymentElementComponent} from "ngx-stripe";
import {StripeElementsOptions} from "@stripe/stripe-js";
import {environment} from "../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {PaymentService} from "./core/payment/payment.service";
import {NotificationService} from "./core/notification/notification.service";
import {AlertDialogComponent} from "./components/alert-dialog/alert-dialog.component";
import {AlertService} from "./core/service/alert.service";
import {initFlowbite} from "flowbite";
import {ToastComponent} from "./components/toast/toast.component";
import {ToastService} from "./core/dialog/toast.service";
import {AutocompleteSearchComponent} from "./components/autocomplete-search/autocomplete-search.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, TuiRootModule, TuiDialogModule, TuiAlertModule, SidebarComponent, FooterComponent, NgIf,
    StripeElementsDirective,
    StripePaymentElementComponent, AlertDialogComponent, ToastComponent, AutocompleteSearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
    providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}]
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'lf-frontend-v2';

  private auth = inject(Auth);

  isLoaded = false;

  isFooterHidden = false;

  isAdmin = false;

  text:string = '';
  status:string = '';
  isShowing:boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private notificationService: NotificationService,
              private alertService: AlertService, private toastService: ToastService) {


    this.router.events.subscribe(res=>{
      if(res instanceof NavigationEnd){
        if(res.url.includes('/admin')){
          this.isAdmin = true;
        }
      }
    })
    this.auth.authStateReady().then(res=>{
      this.isLoaded = true;
      if(this.auth.currentUser != null){

      }
    })
  }

  ngOnInit() {
    this.toastService.openRef.subscribe(res => {
      console.log(res);
      this.text = res.text;
      this.status = res.status;
      this.isShowing = res.show;
    });
  }

  ngAfterViewInit() {
    initFlowbite();
  }

  // get isFooterHidden(){
  //
  // }

  get alertStatusVal(){
    return this.alertService.statusVal;
  }
}
