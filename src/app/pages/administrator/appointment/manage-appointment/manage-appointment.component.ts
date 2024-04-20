import { Component } from '@angular/core';
import {TuiButtonModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiInputModule} from "@taiga-ui/kit";
import {TableComponent} from "../../../../components/table/table.component";
import {TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-manage-appointment',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TableComponent,
    TuiTablePaginationModule,
    FormsModule,
    RouterLink,
    FaIconComponent
  ],
  templateUrl: './manage-appointment.component.html',
  styleUrl: './manage-appointment.component.scss'
})
export class ManageAppointmentComponent {

  faPlus = faPlus;

  size = 3;
  page = 0;

  columns = [
    {key: 'no', value: 'No'},
    {key: 'customer_name', value: 'Customer Name'},
    {key:'contact_number',value:'Contact Number'},
    {key:'email_address',value:'Email Address'},
    {key:'status',value:'Status'},
    {key:'action',value:'Action'}
  ];

  search = '';
}
