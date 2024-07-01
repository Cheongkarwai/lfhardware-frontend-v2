import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import * as Aos from "aos";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {TuiPaginationModule} from "@taiga-ui/kit";
import {TuiTextfieldControllerModule} from "@taiga-ui/core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCheck, faPaintRoller, faShield, faThumbsUp, faUsers} from "@fortawesome/free-solid-svg-icons";
import {register} from "swiper/element/bundle";
import {SwiperOptions} from "swiper/types";
import {SwiperDirective} from "../../core/directive/swiper.directive";
import {CountUpDirective} from "../../core/directive/count-up.directive";
import {ButtonComponent} from "../../components/button/button.component";
import {ToastComponent} from "../../components/toast/toast.component";
import {SearchService} from "../../core/service-provider/search.service";
import {AutocompleteSearchComponent} from "../../components/autocomplete-search/autocomplete-search.component";
import {ProviderService} from "../../core/service-provider/service-provider.service";
import {ServiceProviderRequest} from "../../core/service-provider/service-provider-request.interface";
import {map, Observable, startWith, switchMap} from "rxjs";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgbCarouselModule, RouterModule,
    NgOptimizedImage,  ReactiveFormsModule,
    TuiTextfieldControllerModule, FaIconComponent,
    TuiPaginationModule, SwiperDirective,
    CountUpDirective, ButtonComponent, ToastComponent,
    AutocompleteSearchComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit {

  faPaintRoller = faPaintRoller;
  faUsers = faUsers;

  public config: SwiperOptions = {
    autoHeight: true,
    navigation: false,
    pagination: {clickable: true, dynamicBullets: true},
    slidesPerView: "auto",
    effect:'coverflow',
    allowTouchMove:false,
    autoplay:true
  };

  slides=[
    {image:'././assets/image/brand/3M_wordmark.svg.png',caption:''},
    {image:'././assets/image/brand/2560px-Energizer_Logo.svg.png',caption:''},
    {image:'././assets/image/brand/06397a037bd7576a70d82735483b56f7.jpeg',caption:''},
    {image:'././assets/image/brand/ARALDITE.jpg',caption:''},
    {image:'././assets/image/brand/2560px-Energizer_Logo.svg.png',caption:''},
    {image:'././assets/image/brand/ARROW.jpg',caption:''},
    {image:'././assets/image/brand/HARDEX.png',caption:''},
    {image:'././assets/image/brand/irwin-logo-300px.jpg',caption:''},
    {image:'././assets/image/brand/JOTUN.png',caption:''},
    {image:'././assets/image/brand/Kaercher_Logo_2015.png',caption:''},
    {image:'././assets/image/brand/logo-dunlop-seo.jpg',caption:''},
    {image:'././assets/image/brand/Logo-Milwaukee.jpg',caption:''},
    {image:'././assets/image/brand/Logo_Sika_AG.svg.png',caption:''},
    {image:'././assets/image/brand/Master-logo-Gere-03.jpg',caption:''},
    {image:'././assets/image/brand/Midea_Logo_RGB_blue_on_white_NoRegister.png',caption:''},
    {image:'././assets/image/brand/NIETZ.jpg',caption:''},
    {image:'././assets/image/brand/NIPPON.png',caption:''},
    {image:'././assets/image/brand/og-total-my.png',caption:''},
    {image:'././assets/image/brand/SANCORA.jpg',caption:''},
    {image:'././assets/image/brand/StGuchi logo.png',caption:''},
    {image:'././assets/image/brand/tsunami.png',caption:''},
    {image:'././assets/image/brand/YALE.jpeg',caption:''},

  ];

  index = 0;
  filterForm! :FormGroup;

  searchControl: FormControl;


  services = ['Repair & Maintenance','Home Improvement']
  ads = ['test-ads.jpg','test-ads-2.png','test-ads-3.jpg','test-ads-4.jpg'];

  pageRequest: ServiceProviderRequest = {
    page: 0,
    search: {
      attributes : ['businessName', 'businessEmailAddress'],
      keyword : ''
    },
    page_size: 10,
    sort: '',
    min_price: 0,
    max_price: 0,
    rating: [],
    service_name: '',
    states: [],
    //status: '',
  }

  searchItems$!  : Observable<{image: string, text:string, description:string}[]>;
  constructor(private fb:FormBuilder, private searchService: SearchService,
              private serviceProviderService: ProviderService) {
    this.searchControl = new FormControl<string>('');
  }

  ngOnInit() {

    this.searchItems$ = this.searchControl.valueChanges.pipe(startWith(''),switchMap(search=>{
      if(search){
        this.pageRequest.search.keyword = search;
      }
      return this.serviceProviderService.findAll(this.pageRequest, [], [], null, [])
        .pipe(map(serviceProvidersPage=>{
          return serviceProvidersPage.items.map(serviceProvider=> {
            return {
              image: '',
              text:serviceProvider.name,
              description: ''
            };
          })
        }));
    }))

    Aos.init();
    this.filterForm = this.fb.group({
      service:[''],
      state:[''],
    });
    register();
  }

  protected readonly faThumbsUp = faThumbsUp;
  protected readonly faShield = faShield;
  protected readonly faCheck = faCheck;

  openSearch() {
    this.searchService.show();
  }

  closeSearch(){
    this.searchService.close();
  }
}
