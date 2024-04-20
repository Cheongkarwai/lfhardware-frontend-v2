import {Component, OnDestroy, OnInit} from '@angular/core';
import {TuiDataListWrapperModule, TuiFilterModule, TuiInputModule} from "@taiga-ui/kit";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TuiButtonModule, TuiPrimitiveTextfieldModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {
  BehaviorSubject,
  combineLatestWith,
  filter,
  flatMap,
  map,
  merge,
  Observable, shareReplay,
  startWith,
  Subject,
  switchMap,
  takeUntil
} from "rxjs";
import {CommonModule} from "@angular/common";
import {BreadcrumbComponent} from "../../components/breadcrumb/breadcrumb.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPhone} from "@fortawesome/free-solid-svg-icons";
import {ServiceCategory} from "../../core/service-provider/service-category.interface";
import {ProviderBusinessService} from "../../core/service-provider/provider-business.service";
import {Service} from "../../core/service-provider/service.interface";
import {combineLatest} from "rxjs";
import {Router, RouterLink} from "@angular/router";
import {ButtonComponent} from "../../components/button/button.component";
import {SearchInputComponent} from "../../components/search-input/search-input.component";

@Component({
  selector: 'app-service-directory',
  standalone: true,
  imports: [
    CommonModule,
    TuiInputModule,
    FormsModule,
    TuiTextfieldControllerModule,
    TuiButtonModule,
    TuiFilterModule,
    BreadcrumbComponent,
    FaIconComponent,
    ReactiveFormsModule,
    RouterLink,
    TuiPrimitiveTextfieldModule,
    ButtonComponent,
    TuiDataListWrapperModule,
    SearchInputComponent,
  ],
  templateUrl: './service-directory.component.html',
  styleUrl: './service-directory.component.scss'
})
export class ServiceDirectoryComponent implements OnInit, OnDestroy {

  faPhone = faPhone;

  search: string = '';
  model$!: Observable<any>;
  breadcrumbItems = [
    {
      caption: 'Home',
      routerLink: '',
    },
    {
      caption: 'Directory',
      routerLink: ''
    },
  ];

  serviceCategories$!: Observable<ServiceCategory[]>;
  services$!: Observable<Service[]>;
  categoryClick$ = new BehaviorSubject<number>(5);
  destroy$ = new Subject<void>();
  searchControl = new FormControl('');
  searchServices$!:Observable<string[]>;

  title!:string;
  constructor(private providerBusinessService: ProviderBusinessService, private router:Router) {
  }

  ngOnInit() {
    this.findServiceCategories();
    this.findServices();
  }

  findServices(){
    this.services$ = combineLatest([this.categoryClick$.pipe(startWith(0)),this.searchControl.valueChanges.pipe(startWith(''))]).pipe(flatMap(([serviceCategoryId,search])=>{
      return this.providerBusinessService.findAllServices()
        .pipe(map(services => services
          .filter(serviceCategory =>serviceCategory.id === serviceCategoryId)
          .flatMap(serviceCategory => {
            this.title = serviceCategory.name;
            return serviceCategory.services;
          })
          .filter(service=> {
            const value = search as string;
            return value.length === 0 ? true : service.name.toUpperCase().includes(value.toUpperCase())
          })
        ));
    }));
  }

  findServiceCategories(){
    this.serviceCategories$ = this.providerBusinessService.findAllServices();
    this.searchServices$ = this.providerBusinessService.findAllServices().pipe(map(services=>services.map(service=>service.name)));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  selectCategory(categoryId: number) {
    this.categoryClick$.next(categoryId);
  }

  onFocused($event: boolean) {

  }

  handleOnSubmit(text: any) {
    this.router.navigate(['../','services',text]);
  }
}
