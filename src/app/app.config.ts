import {TuiRootModule} from "@taiga-ui/core";
import {provideAnimations} from "@angular/platform-browser/animations";
import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {en_US, provideNzI18n} from 'ng-zorro-antd/i18n';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {environment} from "../environments/environment.development";
import {preRequestInterceptorInterceptor} from "./core/interceptor/pre-request-interceptor.interceptor";
import {provideNgxStripe} from "ngx-stripe";


export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(), provideRouter(routes), provideNzI18n(en_US),
    importProvidersFrom(FormsModule, TuiRootModule), importProvidersFrom(HttpClientModule), provideAnimations(), importProvidersFrom(provideFirebaseApp(() => initializeApp(
      environment.firebase))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(),
    provideHttpClient(withInterceptors([preRequestInterceptorInterceptor])),
    provideNgxStripe(environment.stripe_publisher_key)],
};
