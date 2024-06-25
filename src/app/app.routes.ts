import {Routes} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {ServicesComponent} from "./pages/services/services.component";
import {ServiceDirectoryComponent} from "./pages/service-directory/service-directory.component";
import {AdministratorComponent} from "./pages/administrator/administrator.component";
import {DashboardComponent} from "./pages/administrator/dashboard/dashboard.component";
import {ProductComponent} from "./pages/administrator/product/product.component";
import {ManageProductComponent} from "./pages/administrator/product/manage-product/manage-product.component";
import {
  ManageServiceProviderComponent
} from "./pages/administrator/service-provider/manage-service-provider/manage-service-provider.component";
import {ServiceProviderComponent} from "./pages/service-provider/service-provider.component";
import {TransactionComponent} from "./pages/administrator/transaction/transaction.component";
import {
  ManageTransactionComponent
} from "./pages/administrator/transaction/manage-transaction/manage-transaction.component";
import {AccountComponent} from "./pages/account/account.component";
import {GetQuoteComponent} from "./pages/get-quote/get-quote.component";
import {RequestServiceFormComponent} from "./pages/get-quote/request-service-form/request-service-form.component";
import {
  ContactAndLocationDetailsFormComponent
} from "./pages/get-quote/contact-and-location-details-form/contact-and-location-details-form.component";
import {ConfirmationPageComponent} from "./pages/get-quote/confirmation-page/confirmation-page.component";
import {ProductListComponent} from "./pages/product/product-list/product-list.component";
import {ProductDetailsComponent} from "./pages/product/product-details/product-details.component";
import {ProductComponent as PublicProductComponent} from './pages/product/product.component';
import {CheckoutComponent} from "./pages/checkout/checkout.component";
import {CartComponent} from "./pages/cart/cart.component";
import {OrderComponent} from "./pages/order/order.component";
import {OrderListComponent} from "./pages/order/order-list/order-list.component";
import {OrderDetailsComponent} from "./pages/order/order-details/order-details.component";
import {ServiceProviderDetailsComponent} from "./pages/service-provider-details/service-provider-details.component";
import {OrderComponent as AdminOrderComponent} from './pages/administrator/order/order.component';
import {
  ServiceProviderComponent as AdminServiceProvider
} from './pages/administrator/service-provider/service-provider.component';
import {ManageOrderComponent} from "./pages/administrator/order/manage-order/manage-order.component";
import {CreateFormComponent} from "./pages/service-provider/create-form/create-form.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {UserOnboardingComponent} from "./pages/user-onboarding/user-onboarding.component";
import {RoleConfirmationComponent} from "./pages/user-onboarding/role-confirmation/role-confirmation.component";
import {
  ServiceProviderOnboardingComponent
} from "./pages/user-onboarding/service-provider-onboarding/service-provider-onboarding.component";
import {CustomerOnboardingComponent} from "./pages/user-onboarding/customer-onboarding/customer-onboarding.component";
import {
  ManageAppointmentComponent as ServiceProviderManageAppointmentComponent
} from "./pages/service-provider/manage-appointment/manage-appointment.component";
import {FaqComponent} from "./pages/faq/faq.component";
import {ManageFaqComponent} from "./pages/administrator/manage-faq/manage-faq.component";
import {
  ServiceProviderOnboardingCompletedComponent
} from "./pages/user-onboarding/service-provider-onboarding/service-provider-onboarding-completed/service-provider-onboarding-completed.component";
import {userOnboardingCompletedGuard} from "./core/guard/user-onboarding-completed";
import {serviceProviderOnboardingCompletedGuard} from "./core/guard/service-provider-onboarding-completed.guard";
import {
  DashboardComponent as ServiceProviderDashboardComponent
} from './pages/service-provider/dashboard/dashboard.component';
import {
  AppointmentComponent,
  AppointmentComponent as CustomerAppointmentComponent
} from './pages/appointment/appointment.component';
import {ViewAppointmentComponent as CustomerViewAppointmentComponent} from './pages/appointment/view-appointment/view-appointment.component';
import {ManageCustomerComponent} from "./pages/administrator/customer/manage-customer/manage-customer.component";
import {CustomerComponent} from "./pages/administrator/customer/customer.component";
import {PublicComponent} from "./pages/public/public.component";
import {adminGuard} from "./core/guard/admin.guard";
import {oauth2Guard} from "./core/guard/oauth2.guard";
import {AccessDeniedComponent} from "./pages/access-denied/access-denied.component";
import {ServiceRequest} from "./pages/service-provider-details/service-request/service-request";
import {PageSettingsComponent} from "./pages/administrator/page-settings/page-settings.component";
import {AboutUsComponent} from "./pages/about-us/about-us.component";
import {AppointmentHistoryComponent} from "./pages/appointment/appointment-history/appointment-history.component";
import {AppointmentDetailsComponent} from "./pages/appointment/appointment-details/appointment-details.component";
import {serviceProviderGuard} from "./core/guard/service-provider.guard";
import {
  ManageAppointmentComponent
} from "./pages/administrator/appointment/manage-appointment/manage-appointment.component";
import {userOnboardingGuard} from "./core/guard/user-onboarding.guard";

export const routes: Routes = [
  {
    path: '', component: PublicComponent,
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeComponent},
      {path: 'about-us', component: AboutUsComponent},
      {path: 'directory', component: ServiceDirectoryComponent},
      {
        path: 'service-provider/:id', children: [
          {path: 'details', component: ServiceProviderDetailsComponent},
          {path: 'service-request', component: ServiceRequest, canActivate: [oauth2Guard]}
        ]
      },
      {
        path: 'appointment', component: CustomerAppointmentComponent, canActivate: [oauth2Guard]
        , children: [
          {
            path: 'view', component: CustomerViewAppointmentComponent,
          },
          {
            path: 'history', component: AppointmentHistoryComponent,
          },
          {
            path: ':serviceId/:serviceProviderId/:createdAt', component: AppointmentDetailsComponent
          }
          ]
      },
      // {path: 'appointment-history', component: AppointmentHistoryComponent, canActivate: [oauth2Guard]},
      {path: 'faq', component: FaqComponent},
      {path: 'services/:service', component: ServicesComponent},
      {
        path: 'user-onboarding', component: UserOnboardingComponent, canActivate: [oauth2Guard,userOnboardingGuard],
        children: [
          {path: '', redirectTo: '/user-onboarding/role-confirmation', pathMatch: 'full'},
          {path: 'role-confirmation', component: RoleConfirmationComponent},
          {
            path: 'service-provider',
            component: ServiceProviderOnboardingComponent,
            canActivate: [serviceProviderOnboardingCompletedGuard]
          },
          {
            path: 'service-provider/completed',
            component: ServiceProviderOnboardingCompletedComponent,
            canActivate: [serviceProviderOnboardingCompletedGuard]
          },
          {path: 'customer', component: CustomerOnboardingComponent}
        ]
      },
      {
        path: 'profile', component: AccountComponent, canActivate: [oauth2Guard, userOnboardingCompletedGuard]
      },
      // {
      //   path: 'service-provider-signup', component: ServiceProviderSignupComponent, children: [
      //     {path: '', redirectTo: 'basic-information', pathMatch: 'full'},
      //     {path: 'basic-information', component: BasicInfoComponent, data: {title: 'Basic Information', index: 0}},
      //     {
      //       path: 'document-and-credentials',
      //       component: DocumentAndCredentialsComponent,
      //       data: {title: 'Document & Credentials', index: 1}
      //     },
      //     {path: 'banking-details', component: BankingDetailsComponent, data: {title: 'Banking Details', index: 2}},
      //     {path: 'albums', component: AlbumComponent, data: {title: 'Albums', index: 3}},
      //   ]
      // },
      {
        path: 'get-quote/:id', component: GetQuoteComponent, children: [
          {path: '', redirectTo: 'service-request-form', pathMatch: 'full'},
          {
            path: 'service-request-form', component: RequestServiceFormComponent,
            children: [{path: 'aircond-installation', component: ContactAndLocationDetailsFormComponent}]
          },
          {path: 'contact-and-location-details-form', component: ContactAndLocationDetailsFormComponent},
          {path: 'confirmation-page', component: ConfirmationPageComponent}
        ]
      },
      {
        path: 'product', component: PublicProductComponent, children: [
          {path: '', redirectTo: 'view', pathMatch: 'full'},
          {path: 'view', component: ProductListComponent},
          {path: 'details/:id', component: ProductDetailsComponent}
        ]
      },
      {
        path: 'checkout', component: CheckoutComponent, canActivate: [oauth2Guard, userOnboardingCompletedGuard]
      },
      {
        path: 'cart', component: CartComponent, canActivate: [oauth2Guard, userOnboardingCompletedGuard]
      },
      {
        path: 'order', component: OrderComponent, canActivate: [oauth2Guard, userOnboardingCompletedGuard], children: [
          {path: '', redirectTo: 'view', pathMatch: 'full'},
          {path: 'view', component: OrderListComponent},
          {path: 'details/:id', component: OrderDetailsComponent}
        ]
      },
    ]
  },
  // {
  //   path: 'auth', component: AuthComponent, canActivateChild: [AuthenticationGuard],
  //   children: [
  //     {path: '', redirectTo: '/auth/login', pathMatch: 'full'},
  //     {path: 'login', component: LoginComponent},
  //     {path: 'signup', component: SignupComponent},
  //     {path: 'send-code', component: ResendCodeComponent},
  //     {path: 'forgot-password', component: ForgotPasswordComponent},
  //     {path: 'mfa', component: MfaComponent}
  //   ]
  // },

  {
    path: 'service-provider-management',
    component: ServiceProviderComponent,
    canActivate: [oauth2Guard, serviceProviderGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: ServiceProviderDashboardComponent},
      {path: 'create-form', component: CreateFormComponent},
      {path: 'manage-appointment', component: ServiceProviderManageAppointmentComponent}
    ]
  },
  {
    path: 'admin-management', component: AdministratorComponent, canActivate: [oauth2Guard, adminGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {
        path: 'product', component: ProductComponent,
        children: [
          {path: 'manage-product', component: ManageProductComponent}
        ]
      },

      {
        path: 'customer', component: CustomerComponent,
        children: [
          {path: 'manage-customer', component: ManageCustomerComponent}
        ]
      },
      {
        path: 'appointment', component: AppointmentComponent,
        children: [
          {path: 'manage-appointment', component: ManageAppointmentComponent}
        ]
      },
      {
        path: 'service-provider', component: AdminServiceProvider,
        children: [
          {path: 'manage-service-provider', component: ManageServiceProviderComponent},
          // {path: 'add-service-provider', component: AddServiceProviderComponent}
        ]
      },
      {
        path: 'page-settings', component: PageSettingsComponent,
        children: [
          {path: 'manage-faq', component: ManageFaqComponent}
        ]
      },
      {
        path: 'manage-faq', component: ManageFaqComponent,
      },
      {
        path: 'order', component: AdminOrderComponent,
        children: [
          {path: 'manage-order', component: ManageOrderComponent},
        ]
      },
      {
        path: 'transaction', component: TransactionComponent,
        children: [
          {path: 'manage-transaction', component: ManageTransactionComponent},
        ]
      }
    ]
  },
  {path: 'access-denied', component: AccessDeniedComponent},
  {path: '**', redirectTo: '404'},
  {path: '404', component: NotFoundComponent},
];
