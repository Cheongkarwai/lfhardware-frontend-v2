import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {
  NgbCollapseModule,
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule} from "@angular/common";
import {TuiAvatarModule, TuiBadgedContentModule} from "@taiga-ui/kit";
import {TuiDropdownModule, TuiHostedDropdownModule, TuiSvgModule} from "@taiga-ui/core";
import {LoginService} from "../../core/user/login.service";
import {catchError, combineLatest, map, Observable, of, share, startWith, switchMap} from "rxjs";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {CartService} from "../../core/cart/cart.service";
import {Category} from "../../core/product/category.interface";
import {Brand} from "../../core/product/brand.interface";
import {ProductService} from "../../core/product/product.service";
import {UserAccount} from "../../core/user/user-account.interface";
import {AccountService} from "../../core/user/account.service";
import {initFlowbite} from "flowbite";
import {Notification, NotificationService} from "../../core/notification/notification.service";
import {CustomerService} from "../../core/customer/customer.service";
import {ProviderService} from "../../core/service-provider/service-provider.service";
import {NotificationComponent} from "../../components/notification/notification.component";
import {SearchService} from "../../core/service-provider/search.service";
import {UserService} from "../../core/user/user.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterModule, NgbCollapseModule, CommonModule, TuiAvatarModule, TuiDropdownModule, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, FaIconComponent, TuiBadgedContentModule, TuiSvgModule, TuiHostedDropdownModule, NotificationComponent,
  ],
  standalone: true
})
export class NavbarComponent implements OnInit, AfterViewInit {

  isCollapsed = true;
  user$!: Observable<UserAccount>;
  userError$!: Observable<UserAccount | null>;
  notifications$!: Observable<Notification[]>;

  isServiceProvider$!: Observable<boolean>;
  isAdministrator$!: Observable<boolean>;

  isMobileMenuOpen = false;

  isMenMegaMenuOpen = false;
  isWomenMegaMenuOpen = false;

  isMenMenuTabOpen = true;
  isWomenMenuTabOpen = false;

  user!: UserAccount | null;
  completedOnBoarding$!: Observable<boolean>;

  numberOfCartItems$!: Observable<number>;
  isProductMegaMenuOpen = false;

  categories$!: Observable<Category[]>;
  brands$!: Observable<Brand[]>;

  constructor(private router: Router,
              private loginService: LoginService,
              private cartService: CartService,
              private productService: ProductService,
              private route: Router,
              private userService: UserService,
              private accountService: AccountService,
              private notificationService: NotificationService,
              private customerService: CustomerService,
              private providerService: ProviderService,
              private searchService: SearchService) {
  }

  ngOnInit() {
    //this.numberOfCartItems$ = this.cartService.findCart().pipe(map(cart=>cart.items.length),catchError(err=> of(0)));
    //this.categories$ = this.productService.findAllProductCategories().pipe(map(categories=> categories.slice(0,4)),shareReplay(1));
    //this.brands$ = this.productService.findAllProductBrands().pipe(map(brands=>brands.slice(0,5)),shareReplay(1));
    this.getUser();
    this.getRoles();
    this.getNotifications();
    this.completedOnBoarding$ = this.customerService.refreshObs$.pipe(startWith(''), switchMap(e=>{
      return combineLatest([
        this.customerService.findCurrentCustomer()
        .pipe(map(customer => !customer)),
        this.providerService.findCurrentServiceProvider().pipe(map(serviceProvider => {
        return !(serviceProvider && serviceProvider.front_identity_card
          && serviceProvider.back_identity_card
          && serviceProvider.ssm &&
          serviceProvider.stripe_account_id);

      })), this.userService.findAllCurrentUserRoles()]).pipe(map(result => !(result[0] && result[1]) || result[2].map(role=> role.name).includes('administrator')));
    }));
  }

  getUser(){
    this.user$ = this.accountService.findCurrentlyLoggedInUser().pipe(share());
    this.userError$ = this.user$.pipe(catchError(err => of(err)));

  }
  getNotifications(){
    this.notifications$ = this.notificationService.findUserNotification();
  }
  getRoles(){
    this.isServiceProvider$ = this.user$.pipe(map(user=> {
      return user?.roles.map(role=> role.name)
        .includes('service_provider');
    }));
    this.isAdministrator$ = this.user$.pipe(map(user=> {
      return user?.roles.map(role=> role.name)
        .includes('administrator');
    }));
  }

  ngAfterViewInit() {
    initFlowbite();
  }

  logout() {
    this.loginService.logout().subscribe(res => {
      window.location.href = res.headers.get('Location') as string;
      this.router.navigate(['']).then(res => {
        //location.reload()
      });
    }, error => {

    });
  }

  protected readonly close = close;

  openMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  showMegaMenu(name: string) {

    switch (name) {
      case 'MEN':
        this.isMenMegaMenuOpen = true;
        this.isWomenMegaMenuOpen = false;
        break;
      case 'WOMEN':
        this.isMenMegaMenuOpen = false;
        this.isWomenMegaMenuOpen = true;
    }
  }

  showMobileMenuTab(name: string) {
    switch (name) {
      case 'MEN':
        this.isMenMenuTabOpen = true;
        this.isWomenMenuTabOpen = false;
        break;

      case 'WOMEN':
        this.isMenMenuTabOpen = false;
        this.isWomenMenuTabOpen = true;
    }
  }

  showProductMegaMenu() {
    this.isProductMegaMenuOpen = !this.isProductMegaMenuOpen;
  }


  addCategoryFilter(category: Category) {
    this.productService.setBrandFilter(null);
    this.isProductMegaMenuOpen = false;
    this.productService.setCategoryFilter(category);
  }

  addBrandFilter(brand: Brand) {
    this.productService.setCategoryFilter(null);
    this.isProductMegaMenuOpen = false;
    this.productService.setBrandFilter(brand);
  }

  login() {
    this.loginService.login();
  }

  openSearch() {
    this.searchService.show();
  }

  navigateToPage(routeUrl: string) {
    this.isMobileMenuOpen = false;
    this.router.navigateByUrl(routeUrl);
  }
}
