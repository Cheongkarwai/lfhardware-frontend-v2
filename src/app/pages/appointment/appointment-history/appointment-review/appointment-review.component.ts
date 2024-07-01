import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgModel, ReactiveFormsModule, Validators} from "@angular/forms";
import {ButtonComponent} from "../../../../components/button/button.component";
import {RatingComponent} from "../../../../components/rating/rating.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ProviderService} from "../../../../core/service-provider/service-provider.service";
import {map, Observable} from "rxjs";
import {ServiceProviderDetails} from "../../../../core/service-provider/service-provider-details";
import {TextareaComponent} from "../../../../components/textarea/textarea.component";
import {CheckboxComponent} from "../../../../components/checkbox/checkbox.component";
import {TuiRatingModule} from "@taiga-ui/kit";
import {TuiTextfieldControllerModule} from "@taiga-ui/core";
import {ToastService} from "../../../../core/dialog/toast.service";
import {Appointment} from "../../../../core/appointment/appointment.interface";
import {AppointmentService} from "../../../../core/appointment/appointment.service";

@Component({
  selector: 'app-appointment-review',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    RatingComponent,
    TextareaComponent,
    CheckboxComponent,
    TuiRatingModule,
    TuiTextfieldControllerModule
  ],
  templateUrl: './appointment-review.component.html',
  styleUrl: './appointment-review.component.scss'
})
export class AppointmentReviewComponent implements OnInit {

  rating!: number;

  reviewForm: FormGroup = this.fb.group({
    description: ['', Validators.required],
    rating: [0],
    termAndCondition: [false, [Validators.requiredTrue]]
  });


  constructor(private dialog: MatDialog,
              public dialogRef: MatDialogRef<AppointmentReviewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {appointment: Appointment},
              private fb: FormBuilder,
              private providerService: ProviderService,
              private toastService: ToastService,
              private appointmentService: AppointmentService) {
  }

  ngOnInit() {
  }

  get descriptionControl(){
    return this.reviewForm.get('description') as FormControl<string>;
  }
  get termAndConditionControl(){
    return this.reviewForm.get('termAndCondition') as FormControl<boolean>;
  }

  get ratingControl(){
    return this.reviewForm.get('rating') as FormControl<number>;
  }

  submitReview() {
    this.reviewForm.markAllAsTouched();

    if(this.reviewForm.valid){
      const {description, rating} = this.reviewForm.getRawValue();
      this.providerService.saveReview(this.data.appointment.service_provider.id, this.data.appointment.service.id, this.data.appointment.service_provider.id,
        this.data.appointment.customer.id, this.data.appointment.created_at,{
        description: description,
        rating: rating
      }).subscribe({
        next:res=>{
          this.dialogRef.close();
          this.dialogRef.afterClosed().subscribe({
            next:res=> {
              this.toastService.open('Review submitted', 'success');
              this.appointmentService.refreshAppointment$.next();
            }
          })
        },
        error:err=>{
          this.toastService.open('Something wrong when submit review', 'error')
        }
      })
    }
  }


}
