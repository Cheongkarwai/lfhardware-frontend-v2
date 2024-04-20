import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {MatSortModule, Sort} from "@angular/material/sort";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {RouterModule} from "@angular/router";
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDialogService, TuiDropdownModule,
  TuiHostedDropdownModule, TuiSvgModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {
  TuiComboBoxModule, TuiDataListDropdownManagerModule,
  TuiDataListWrapperModule,
  TuiFilterModule,
  TuiHighlightModule,
  TuiTagModule
} from "@taiga-ui/kit";
import {AbstractControl, FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {faCancel} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {TuiActiveZoneModule, TuiLetModule} from "@taiga-ui/cdk";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    ScrollingModule,
    RouterModule,
    TuiButtonModule,
    TuiTagModule,
    TuiComboBoxModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapperModule,
    TuiFilterModule,
    FormsModule,
    FaIconComponent,
    TuiHighlightModule,
    TuiHostedDropdownModule,
    TuiDataListModule,
    TuiActiveZoneModule,
    TuiLetModule,
    TuiDataListDropdownManagerModule,
    TuiDropdownModule,
    TuiSvgModule
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class TableComponent implements OnInit {

  faNotAvailable = faCancel;

  @Input() data:any = {items:[]};
  // @ts-ignore
  @Input() columns: any[] ;
  @Input() filterItems = [{IT:'IT'}];
  items = ['IT'];
  orderDirections = ['ASC','DESC'];
  sortBy={
    order:'',
    field:''
  }
  @Input() enableDelete = false;
  @Input() enableEdit = false;
  @Input() enableCancel = false;
  @Input() enableComplete = false;
  @Input() enableInfo = false;
  @Input() menuItems:any[] = [];

  @Input() layout = 'grid';
  @Input() search!: string;
  @Input() multiSelect: boolean = false;

  displayedColumns: string[] = [];

  @Output() sort = new EventEmitter<Sort>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() complete = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();
  @Output() contextMenu = new EventEmitter<any>();


  isSelected:boolean = false;

  tableForm = this.fb.group({
    checkboxes: new FormArray<FormControl<boolean | null>>([])
  })

  dropdownOpen = false;



  constructor(@Inject(TuiDialogService) private readonly dialogs: TuiDialogService, private fb:FormBuilder) {
  }

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(column => column.key);
    if(this.multiSelect){
      this.data.items.forEach((e:any)=> this.checkboxFormArray.push(new FormControl(this.isSelected)));
    }
  }

  handleSort(event: Sort) {
    event.active = event.active
      .split("_")
      .reduce(
        (res, word, i) =>
          i === 0
            ? word.toLowerCase()
            : `${res}${word.charAt(0).toUpperCase()}${word
              .substr(1)
              .toLowerCase()}`,
        ""
      );
    this.sort.emit(event);
  }

  handleEdit(event:any){
    this.edit.emit(event);
  }

  handleDelete(event:any){
    console.log(event);
    this.delete.emit(event);
  }

  handleCancel(event:any){
    this.cancel.emit(event);
  }
  handleComplete(event:any){
    this.complete.emit(event);
  }


  remove(item: any) {

  }

  protected readonly faCancel = faCancel;
  yellow = '#f1e740';

  handleInfo(event: any) {
    this.view.emit(event);
  }

  handleContextMenu(title:string, item: any) {
    this.contextMenu.emit({action: title, data : item});
  }


  checkAll() {
    this.isSelected = !this.isSelected;
    this.checkboxFormArray
      .setValue(this.checkboxFormArray.value.map((value:boolean) => this.isSelected));
  }

  get checkboxFormArray(){
    return this.tableForm.controls['checkboxes'] as FormArray;
  }
}
