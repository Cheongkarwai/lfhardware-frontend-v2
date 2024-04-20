import {Component, Input, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {SearchService} from "../../core/service-provider/search.service";

@Component({
  selector: 'app-autocomplete-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './autocomplete-search.component.html',
  styleUrl: './autocomplete-search.component.scss'
})
export class AutocompleteSearchComponent implements OnInit{

  @Input()
  items : {image: string, text:string}[] = [];

  @Input()
  control!: FormControl;

  isShowing: boolean = false;

  constructor(private searchService: SearchService) {
  }

  ngOnInit() {
    this.searchService.openObs.subscribe(res=>{
      this.isShowing = res;
    })
  }


  close(event:MouseEvent) {
    this.searchService.close();
  }
}
