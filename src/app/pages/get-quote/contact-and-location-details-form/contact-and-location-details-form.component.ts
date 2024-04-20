import { Component } from '@angular/core';
import {TuiLabelModule, TuiTextfieldControllerModule, TuiTooltipModule} from "@taiga-ui/core";
import {TuiCheckboxLabeledModule, TuiInputModule} from "@taiga-ui/kit";

@Component({
  selector: 'app-contact-and-location-details-form',
  standalone: true,
  imports: [
    TuiLabelModule,
    TuiInputModule,
    TuiTooltipModule,
    TuiTextfieldControllerModule,
    TuiCheckboxLabeledModule
  ],
  templateUrl: './contact-and-location-details-form.component.html',
  styleUrl: './contact-and-location-details-form.component.scss'
})
export class ContactAndLocationDetailsFormComponent {

}
