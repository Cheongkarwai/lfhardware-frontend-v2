import {TuiAlertModule, TuiDialogModule, TuiRootModule} from "@taiga-ui/core";
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from "./fragment/navbar/navbar.component";
import {SidebarComponent} from "./fragment/sidebar/sidebar.component";
import {FooterComponent} from "./fragment/footer/footer.component";
import {NgIf} from "@angular/common";
import {StripeElementsDirective, StripePaymentElementComponent} from "ngx-stripe";
import {AlertDialogComponent} from "./components/alert-dialog/alert-dialog.component";
import {initFlowbite} from "flowbite";
import {ToastComponent} from "./components/toast/toast.component";
import {AutocompleteSearchComponent} from "./components/autocomplete-search/autocomplete-search.component";
import {UserIdleService} from "angular-user-idle";
import {LoginService} from "./core/user/login.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, TuiRootModule, TuiDialogModule, TuiAlertModule, SidebarComponent, FooterComponent, NgIf,
    StripeElementsDirective,
    StripePaymentElementComponent, AlertDialogComponent, ToastComponent, AutocompleteSearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'lf-frontend-v2';

  isAdmin = false;
  isServiceProvider = false;

  private isSessionExpiredDialogOpen = false;


  constructor(private activatedRoute: ActivatedRoute, private router: Router,
              private userIdleService: UserIdleService, private loginService: LoginService,
              private dialog: MatDialog) {


    this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        if (res.url.includes('/admin') || res.url.includes('/user-onboarding')) {
          this.isAdmin = true;
        }
        if (res.url.includes('/user-onboarding/service-provider')) {
          this.isServiceProvider = true;
        }

      }
    })
  }

  ngOnInit() {

    // this.userIdleService.startWatching();
    //
    // this.userIdleService.onIdleStatusChanged().subscribe(res => console.log('Idle status changed'))
    //
    // this.userIdleService.onTimerStart().subscribe(res => {
    //   if (!this.isSessionExpiredDialogOpen) {
    //       this.isSessionExpiredDialogOpen = true;
    //       this.dialog.open(AlertDialogComponent, {
    //         data: {
    //           title: 'Login session is expired',
    //           text: 'You have been inactive for 5 minutes. Auto-logout in 5 seconds..',
    //           status: Status.ERROR
    //         }
    //       })
    //   }
    // })
    //
    // this.userIdleService.onTimeout().subscribe(res=>{
    //   this.loginService.logout().subscribe(res => {
    //     window.location.href = res.headers.get('Location') as string;
    //   });
    // })

  }

  ngAfterViewInit() {
    initFlowbite();
  }
}
