import { Component } from '@angular/core';
import {RouterModule} from "@angular/router";
import {environment} from "../../../environments/environment.development";

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss'
})
export class AccessDeniedComponent {
  customerSupportEmail: string = environment.customer_support_email;
}
