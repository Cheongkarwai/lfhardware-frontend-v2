import {TuiRootModule} from "@taiga-ui/core";
import {provideAnimations} from "@angular/platform-browser/animations";
import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {en_US, provideNzI18n} from 'ng-zorro-antd/i18n';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HttpClientXsrfModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import {environment} from "../environments/environment.development";
import {preRequestInterceptorInterceptor} from "./core/interceptor/pre-request-interceptor.interceptor";
import {provideNgxStripe} from "ngx-stripe";
import {provideUserIdleConfig, UserIdleModule} from "angular-user-idle";


export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(), provideRouter(routes), provideNzI18n(en_US),
    importProvidersFrom(FormsModule, TuiRootModule),
    provideUserIdleConfig({ idle: 300, timeout: 5, ping: 0 }),
    importProvidersFrom(HttpClientModule, HttpClientXsrfModule.withOptions({
      cookieName: "XSRF-TOKEN",
      headerName: 'X-XSRF-Token',
    })), provideAnimations(),
    provideHttpClient(withInterceptors([preRequestInterceptorInterceptor])),
    provideNgxStripe(environment.stripe_publisher_key), provideAnimations()],
};
