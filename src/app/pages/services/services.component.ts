import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterModule} from "@angular/router";
import {NzBreadCrumbComponent, NzBreadCrumbItemComponent} from "ng-zorro-antd/breadcrumb";
import {
  TuiBreadcrumbsModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiFilterModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputRangeModule,
  TuiPaginationModule,
  TuiRatingModule,
  TuiSelectModule,
  TuiStringifyPipeModule,
  TuiTagModule
} from "@taiga-ui/kit";
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {BehaviorSubject, combineLatest, map, Observable, share, startWith, Subject, switchMap} from "rxjs";
import {TuiCurrencyPipeModule} from "@taiga-ui/addon-commerce";
import * as Aos from "aos";
import {BreadcrumbComponent} from "../../components/breadcrumb/breadcrumb.component";
import {State} from "../../core/state/state.interface";
import {StateService} from "../../core/state/state.service";
import {ProviderService} from "../../core/service-provider/service-provider.service";
import {ServiceProviderRequest} from "../../core/service-provider/service-provider-request.interface";
import {Pageable} from "../../core/page/pagination.interface";
import {ServiceProvider} from "../../core/service-provider/service-provider.interface";
import {LoadingSpinnerComponent} from "../../components/loading-spinner/loading-spinner.component";
import {MathCeilPipe} from "../../core/pipe/math-ceil.pipe";
import {ButtonComponent} from "../../components/button/button.component";
import {RangeInputComponent} from "../../components/range-input/range-input.component";
import {RatingComponent} from "../../components/rating/rating.component";
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-for-sale',
  standalone: true,
  imports: [CommonModule, RouterModule,
    NzBreadCrumbItemComponent, NzBreadCrumbComponent,
    TuiBreadcrumbsModule, TuiLinkModule,
    TuiInputModule, FormsModule, TuiTextfieldControllerModule,
    TuiComboBoxModule, ReactiveFormsModule, TuiDataListWrapperModule,
    TuiFilterModule, TuiButtonModule, TuiRatingModule, TuiTagModule,
    TuiSvgModule, TuiDataListModule, TuiHostedDropdownModule,
    TuiSelectModule, TuiInputRangeModule,
    NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, TuiDropdownModule,
    TuiInputNumberModule, TuiCurrencyPipeModule, BreadcrumbComponent,
    TuiPaginationModule, TuiFilterByInputPipeModule, TuiStringifyPipeModule,
    LoadingSpinnerComponent, MathCeilPipe, ButtonComponent, RangeInputComponent, RatingComponent,],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  breadcrumbItems = [
    {
      caption: 'Home',
      routerLink: '',
    },
    {
      caption: 'Directory',
      routerLink: '/directory'
    },
    {
      caption: '',
      routerLink: ''
    }
  ];

  filterForm = this.fb.group({
    search: [''],
    min_price: [0],
    max_price: [0],
    rating: this.fb.array([]),
    states: this.fb.array([])
  });

  open = false;
  isStateFilterMenuOpen = false;
  isRatingFilterMenuOpen = false;
  isPriceFilterMenuOpen = false;
  isSortMenuOpen = false;

  states$!: Observable<State[]>;

  pageRequest: ServiceProviderRequest = {
    search: {
      attributes: [],
      keyword: ''
    },
    sort: "",
    page: 0,
    page_size: 5,
    service_name: '',
    max_price: 0,
    min_price: 0,
    rating: [],
    states: [],
    // status: ''
  }

  providerPageable$!: Observable<Pageable<ServiceProvider>>;

  pageRequest$ = new BehaviorSubject<number>(0);

  serviceProvidersName$!: Observable<string[]>;

  handleFilter$ = new Subject<any>();

  pagination$: BehaviorSubject<ServiceProviderRequest> = new BehaviorSubject<ServiceProviderRequest>(this.pageRequest);


  filters:{title: string,category:string}[] = [];

  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder, private stateService: StateService, private providerService: ProviderService) {
    this.pageRequest.service_name = activatedRoute.snapshot.params['service'];
    this.breadcrumbItems[2].caption = this.pageRequest.service_name;
  }

  ngOnInit(): void {
    initFlowbite();
    Aos.init();
    for(let i = 0 ; i < 5; i++){
      this.addRatingControl(i,i+1);
    }
    this.findAllStates();
    this.findProvidersName();
    this.findAllProviders();

  }

  findAllStates() {
      this.states$ = this.stateService.findAll().pipe(map(states => {
        states.forEach(state => this.addStateControl(state));
        return states;
      }));
  }

  findProvidersName() {
    this.serviceProvidersName$ = this.providerService.findAll(this.pagination$.value, [], [] , null, [])
      .pipe(share(), map(pageable => pageable.items.map(provider => provider.name)));
  }

  findAllProviders() {
    //Display list of provider
    this.providerPageable$ = combineLatest([this.pagination$.pipe(startWith(this.pageRequest)),
      this.handleFilter$.pipe(startWith('')), this.filterForm.controls.states.valueChanges.pipe(startWith([])),
      this.filterForm.controls.rating.valueChanges.pipe(startWith([])), this.filterForm.controls.max_price.valueChanges.pipe(startWith(0))])
      .pipe(
        switchMap(([page, formChanges, states, ratings, maxPrice]) => {
          this.filters = []
          if(states.length > 0){
            // @ts-ignore
            page.states = states.filter(state=> state.selected).map(control=> control.state.name);
            const stateFilters = page.states.map(state=>{
              return {
                title: state,
                category: 'state'
              };
            });
            this.filters.push(...stateFilters);
          }
          if(ratings.length > 0){
            // @ts-ignore
            page.rating = ratings.filter(rating=> rating.selected).map(rating=> rating);
            const ratingFilters = page.rating.map(rating=>{
              // @ts-ignore
              return {
                title: rating.min + '-' + rating.max,
                category: 'rating'
              }
            })
            this.filters.push(...ratingFilters);
          }
          if(maxPrice){
            page.max_price = maxPrice;
            this.filters.push({
              title: 'MYR '+maxPrice,
              category: 'maxPrice'
            });
          }
          return this.providerService.findAll(page, ['APPROVED'], [] , null, []).pipe(map(pageableProviders => pageableProviders))
        }));
  }

  closeCanvasMenu() {
    this.open = false;
  }

  onModelChangeFilter($event: any) {

  }

  fetchPage(page: number) {
    this.pageRequest$.next(page);
  }

  applyFilter() {
    this.pageRequest$.next(0);
    this.handleFilter$.next('');
  }

  clearFilter() {
    this.filterForm.reset({
      search: '',
      min_price: 0,
      max_price: 0,
      states: [],
      rating: []
    });
    this.handleFilter$.next('');
  }

  get maxPriceControl() {
    return this.filterForm.controls.max_price as FormControl;
  }

  get ratingFormArray() {
    return this.filterForm.controls.rating as FormArray;
  }

  addRatingControl(min: number, max: number) {
    this.ratingFormArray.push(this.fb.group({
      min: min.toFixed(1),
      max: max.toFixed(1),
      title: min + '-' + max,
      selected: false
    }));
  }


  addStateControl(state: State) {
    this.stateFormArray.push(this.fb.group({
      state: state,
      selected: false
    }));
  }

  get stateFormArray() {
    return this.filterForm.controls.states as FormArray;
  }

  toggleSortMenu() {
    this.isStateFilterMenuOpen = false;
    this.isRatingFilterMenuOpen = false;
    this.isPriceFilterMenuOpen = false;
    this.isSortMenuOpen = !this.isSortMenuOpen;
  }

  toggleStateMenu(){
    this.isSortMenuOpen = false;
    this.isRatingFilterMenuOpen = false;
    this.isPriceFilterMenuOpen = false;
    this.isStateFilterMenuOpen = !this.isStateFilterMenuOpen;
  }

  toggleRatingMenu(){
    this.isSortMenuOpen = false;
    this.isStateFilterMenuOpen = false;
    this.isPriceFilterMenuOpen = false;
    this.isRatingFilterMenuOpen = !this.isRatingFilterMenuOpen;
  }
  togglePriceMenu() {
    this.isSortMenuOpen = false;
    this.isRatingFilterMenuOpen = false;
    this.isStateFilterMenuOpen = false;
    this.isPriceFilterMenuOpen = !this.isPriceFilterMenuOpen;
  }

  resetFilter() {

  }

  removeFilter(filter:{category:string, title:string}) {
    if(filter.category === 'state'){
      for(let control of this.stateFormArray.controls){
        const controlValue = control.getRawValue();
       if(controlValue.state.name === filter.title){
         controlValue.selected = false;
         control.setValue(controlValue);
         break;
       }
      }
    }
    if(filter.category === 'rating'){
      for(let control of this.ratingFormArray.controls){
        const controlValue = control.getRawValue();
        if(controlValue.title === filter.title){
          controlValue.selected = false;
          control.setValue(controlValue);
          break;
        }
      }
    }

  }

  getStateFilterCount(){
    return this.filters.filter(filter=> filter.category === 'state').length;
  }


  openCanvasMenu() {
    this.open = true;
  }
}
