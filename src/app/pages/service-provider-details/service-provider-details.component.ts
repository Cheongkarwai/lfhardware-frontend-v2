import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {ProviderService} from "../../core/service-provider/service-provider.service";
import {BehaviorSubject, map, Observable, Subject, combineLatest, startWith, switchMap} from "rxjs";
import {ServiceProviderDetails, ServiceProviderReview} from "../../core/service-provider/service-provider-details";
import {TuiCarouselModule, TuiRatingModule} from "@taiga-ui/kit";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {BreadcrumbComponent} from "../../components/breadcrumb/breadcrumb.component";
import {ButtonComponent} from "../../components/button/button.component";
import {CheckoutService} from "../../core/checkout/checkout.service";
import {AverageRatingPipe} from "../../core/pipe/average-rating.pipe";
import {RatingComponent} from "../../components/rating/rating.component";
import {initFlowbite} from "flowbite";
import {AppointmentService} from "../../core/appointment/appointment.service";
import {Pageable, PageRequest} from "../../core/page/pagination.interface";
import {MathCeilPipe} from "../../core/pipe/math-ceil.pipe";
import {RangePipe} from "../../core/pipe/range.pipe";
import {LoadMoreButtonComponent} from "../../components/load-more-button/load-more-button.component";
import {ServiceProvider} from "../../core/service-provider/service-provider.interface";

@Component({
  selector: 'app-service-provider-details',
  standalone: true,
  imports: [CommonModule, TuiRatingModule, ReactiveFormsModule, TuiCarouselModule, RouterModule, BreadcrumbComponent, ButtonComponent, AverageRatingPipe, RatingComponent, MathCeilPipe, RangePipe, LoadMoreButtonComponent],
  templateUrl: './service-provider-details.component.html',
  styleUrl: './service-provider-details.component.scss'
})
export class ServiceProviderDetailsComponent implements OnInit, AfterViewInit {

  breadcrumbItems = [
    {
      caption: 'Home',
      routerLink: '',
    },
    {
      caption: 'Service',
      routerLink: ''
    },

  ];

  serviceProviderId!: string;

  serviceProviderDetails$!: Observable<ServiceProviderDetails>;
  serviceProviderReviews$!: Observable<Pageable<ServiceProviderReview>>;
  ratingFormControl = new FormControl(0);
  sortControl: FormControl<string | null> = new FormControl<string | null>('DESC');
  ratingFilterControl: FormControl<string | null> = new FormControl<string| null>('');

  items = [1, 2, 3, 4, 5];
  index = 0;

  reviewPageRequest: PageRequest = {
    page: 0,
    page_size: 10,
    sort: '',
    search: {
      attributes: [],
      keyword: ''
    }
  };

  handleReviewPagination: BehaviorSubject<PageRequest> = new BehaviorSubject<PageRequest>(this.reviewPageRequest);


  checkoutService = inject(CheckoutService);

  constructor(private activatedRoute: ActivatedRoute, private serviceProviderService: ProviderService,
              private router: Router, private appointmentService: AppointmentService) {
    this.serviceProviderId = activatedRoute.snapshot.params['id'] as string;
    this.breadcrumbItems.push({caption: 'Details', routerLink: ''})
  }

  ngOnInit() {
    this.getServiceProviderDetails(this.serviceProviderId);
    this.getServiceProviderReviews(this.serviceProviderId);
  }

  ngAfterViewInit() {
    initFlowbite();
  }

  getServiceProviderReviews(id: string) {
    this.serviceProviderReviews$ = combineLatest([
      this.handleReviewPagination.pipe(startWith(this.reviewPageRequest)),
      this.ratingFilterControl.valueChanges.pipe(startWith('')),
      this.sortControl.valueChanges.pipe(startWith('DESC'))
    ])
      .pipe(switchMap(([pageRequest, rating, sort]) => {
        if(sort){
          pageRequest.sort = `createdAt,${sort}`;
        }
        return this.serviceProviderService.findServiceProviderReviewById(id, pageRequest, rating);
      }));
  }

  getServiceProviderDetails(id: string) {
    this.serviceProviderDetails$ = this.serviceProviderService.findById(id).pipe(map(serviceProvider => {
      this.ratingFormControl.setValue(serviceProvider.rating);
      return serviceProvider;
    }));
  }


  bookAppointment(serviceProvider: ServiceProviderDetails) {
    this.appointmentService.save({
      service_provider_id: serviceProvider.id,
      service_id: 1,
      estimated_price: 100000
      ,
      status: 'PENDING'
    }).subscribe({
      next:link=>{
        window.location.href = link;
      }
    });
    this.router.navigate(['../service-request'], {relativeTo: this.activatedRoute})
  }


  loadMore() {
    this.reviewPageRequest.page++;
    this.handleReviewPagination.next(this.reviewPageRequest);
  }

  prevPage($event: MouseEvent){
    this.reviewPageRequest.page--;
    this.handleReviewPagination.next(this.reviewPageRequest);
  }
  nextPage($event: MouseEvent) {
    this.reviewPageRequest.page++;
    this.handleReviewPagination.next(this.reviewPageRequest);
  }

}
