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
import {
  AddServiceProviderComponent
} from "./pages/administrator/service-provider/add-service-provider/add-service-provider.component";
import {ServiceProviderComponent} from "./pages/administrator/service-provider/service-provider.component";
import {AppointmentComponent} from "./pages/administrator/appointment/appointment.component";
import {UserComponent} from "./pages/administrator/user/user.component";
import {ManageUserComponent} from "./pages/administrator/user/manage-user/manage-user.component";
import {TransactionComponent} from "./pages/administrator/transaction/transaction.component";
import {
  ManageTransactionComponent
} from "./pages/administrator/transaction/manage-transaction/manage-transaction.component";
import {ManageWorkerComponent} from "./pages/administrator/worker/manage-worker/manage-worker.component";
import {AuthComponent} from "./pages/auth/auth.component";
import {LoginComponent} from "./pages/auth/login/login.component";
import {SignupComponent} from "./pages/auth/signup/signup.component";
import {ResendCodeComponent} from "./pages/auth/resend-code/resend-code.component";
import {AuthenticationGuard} from "./core/guard/auth.guard";
import {ProfileComponent} from "./pages/profile/profile.component";
import {ServiceProviderSignupComponent} from "./pages/service-provider-signup/service-provider-signup.component";
import {BasicInfoComponent} from "./pages/service-provider-signup/basic-info/basic-info.component";
import {
  DocumentAndCredentialsComponent
} from "./pages/service-provider-signup/document-and-credentials/document-and-credentials.component";
import {BankingDetailsComponent} from "./pages/service-provider-signup/banking-details/banking-details.component";
import {AlbumComponent} from "./pages/service-provider-signup/album/album.component";
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
import {cartGuard} from "./core/cart/guard/cart.guard";
import {OrderComponent} from "./pages/order/order.component";
import {OrderListComponent} from "./pages/order/order-list/order-list.component";
import {OrderDetailsComponent} from "./pages/order/order-details/order-details.component";
import {MfaComponent} from "./pages/auth/mfa/mfa.component";
import {ServiceProviderDetailsComponent} from "./pages/service-provider-details/service-provider-details.component";
import {OrderComponent as AdminOrderComponent} from './pages/administrator/order/order.component';
import {ManageOrderComponent} from "./pages/administrator/order/manage-order/manage-order.component";
import {CreateFormComponent} from "./pages/service-provider/create-form/create-form.component";
import {ForgotPasswordComponent} from "./pages/auth/forgot-password/forgot-password.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";

export const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'directory', component: ServiceDirectoryComponent},
  {path: 'service-provider-details/:id', component: ServiceProviderDetailsComponent},
  {path: 'services/:service', component: ServicesComponent},
  {
    path: 'auth', component: AuthComponent, canActivateChild: [AuthenticationGuard],
    children: [
      {path: '', redirectTo: '/auth/login', pathMatch: 'full'},
      {path: 'login', component: LoginComponent},
      {path: 'signup', component: SignupComponent},
      {path: 'send-code', component: ResendCodeComponent},
      {path: 'forgot-password', component: ForgotPasswordComponent},
      {path: 'mfa', component: MfaComponent}
    ]
  },
  {
    path: 'profile', component: ProfileComponent, canActivate: [cartGuard]
  },
  {
    path: 'service-provider-signup', component: ServiceProviderSignupComponent, children: [
      {path: '', redirectTo: 'basic-information', pathMatch: 'full'},
      {path: 'basic-information', component: BasicInfoComponent, data: {title: 'Basic Information', index: 0}},
      {
        path: 'document-and-credentials',
        component: DocumentAndCredentialsComponent,
        data: {title: 'Document & Credentials', index: 1}
      },
      {path: 'banking-details', component: BankingDetailsComponent, data: {title: 'Banking Details', index: 2}},
      {path: 'albums', component: AlbumComponent, data: {title: 'Albums', index: 3}},
    ]
  },
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
    path: 'checkout', component: CheckoutComponent, canActivate: [cartGuard]
  },
  {
    path: 'cart', component: CartComponent, canActivate: [cartGuard]
  },
  {
    path: 'order', component: OrderComponent, canActivate: [cartGuard], children: [
      {path: '', redirectTo: 'view', pathMatch: 'full'},
      {path: 'view', component: OrderListComponent},
      {path: 'details/:id', component: OrderDetailsComponent}
    ]
  },
  {
    path: 'service-provider', component: ServiceProviderComponent,
    children: [
      {path: '', redirectTo: 'create-form', pathMatch: 'full'},
      {path: 'create-form', component: CreateFormComponent},
    ]
  },
  {
    path: 'admin', component: AdministratorComponent,
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
        path: 'service-provider', component: ServiceProviderComponent,
        children: [
          {path: 'manage-service-provider', component: ManageServiceProviderComponent},
          {path: 'add-service-provider', component: AddServiceProviderComponent}
        ]
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
      },
      {
        path: 'worker', component: AppointmentComponent,
        children: [
          {path: 'manage-worker', component: ManageWorkerComponent},
        ]
      },
      {
        path: 'user', component: UserComponent,
        children: [
          {path: 'manage-user', component: ManageUserComponent},
          // {path: 'add-appointment',component: AddAppointmentComponent}
        ]
      }
    ]
  },
  {path: '**', redirectTo: '404'},
  {path: '404', component: NotFoundComponent},
];
