import { Component } from '@angular/core';
import {TuiInputModule, TuiInputNumberModule} from "@taiga-ui/kit";
import {TuiTextfieldControllerModule} from "@taiga-ui/core";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-mfa',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiInputNumberModule
  ],
  templateUrl: './mfa.component.html',
  styleUrl: './mfa.component.scss'
})
export class MfaComponent {

}
