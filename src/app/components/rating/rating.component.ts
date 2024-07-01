import {Component, Input} from '@angular/core';
import {TuiRatingModule} from "@taiga-ui/kit";
import {TuiTextfieldControllerModule} from "@taiga-ui/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [
    TuiRatingModule,
    TuiTextfieldControllerModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class RatingComponent {

  @Input()
  rating: any = 0;

  @Input()
  readOnly: boolean = true;

}
