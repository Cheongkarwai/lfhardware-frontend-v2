import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {initFlowbite} from "flowbite";
import {filter} from "rxjs";

export interface Filter {
  title: string;
  items: { title: string, value: any}[],
  type: string;
  formArray: FormArray<any>
}

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.scss'
})
export class TableHeaderComponent implements OnInit, AfterViewInit {

  @Input()
  totalElements: number = 0;

  @Input()
  totalPages: number = 0;

  @Input()
  currentPage: number = 0;

  @Input()
  searchControl!: FormControl<string | null>;

  @Input()
  filters: Filter[] = [];

  @Input()
  actions: string [] = [];

  @Output()
  handleAction: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit() {
  }

  ngAfterViewInit() {
    initFlowbite();
  }

  getFormArrayControl(i : number, j :number){
    if(this.filters.length > i) {
      return this.filters[i].formArray.at(j) as FormControl;
    }
    return new FormControl<any>('');
  }

  clearAll(){
    this.searchControl.reset();
    this.filters.forEach(filter=> {
      for(let i = 0;i < filter.formArray.length; i++){
        filter.formArray.at(i).setValue(false);
      }
    })
  }



  getActionIndex(i: number) {
    this.handleAction.emit(i);
  }
}
