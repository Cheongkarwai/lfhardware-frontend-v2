import {Component, inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router, RouterModule} from "@angular/router";
import {
  NgbCollapseModule,
  NgbDropdown,
  NgbDropdownButtonItem, NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";
import {Auth, signOut, user, User as FirebaseUser} from "@angular/fire/auth";
import {CommonModule} from "@angular/common";
import {TuiAvatarModule, TuiBadgedContentModule} from "@taiga-ui/kit";
import {TuiDropdownModule, TuiHostedDropdownModule, TuiSvgModule} from "@taiga-ui/core";
import {LoginService} from "../../core/user/login.service";
import {catchError, map, Observable, of, shareReplay} from "rxjs";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCartShopping, faHeart} from "@fortawesome/free-solid-svg-icons";
import {Cart} from "../../core/cart/cart.interface";
import {CartService} from "../../core/cart/cart.service";
import {Category} from "../../core/product/category.interface";
import {Brand} from "../../core/product/brand.interface";
import {ProductService} from "../../core/product/product.service";
// import {NotificationToast} from "../../shared/notification/customized.alert";
// import {UserService} from "../../core/user/user.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterModule, NgbCollapseModule, CommonModule, TuiAvatarModule, TuiDropdownModule, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, FaIconComponent, TuiBadgedContentModule, TuiSvgModule, TuiHostedDropdownModule,
  ],
  standalone: true
})
export class NavbarComponent implements OnInit {

  protected readonly faCartShopping = faCartShopping;

  isCollapsed = true;
  user$!:Observable<FirebaseUser | null>;
  isLoggedIn$!: Observable<boolean>;

  isMobileMenuOpen = false;

  isMenMegaMenuOpen = false;
  isWomenMegaMenuOpen = false;

  isMenMenuTabOpen = true;
  isWomenMenuTabOpen = false;

  private auth = inject(Auth);

  user!:FirebaseUser | null;

  numberOfCartItems$: Observable<number>;
  isProductMegaMenuOpen = false;

  categories$:Observable<Category[]>;
  brands$:Observable<Brand[]>;

  constructor(private router: Router,private loginService:LoginService, private cartService:CartService,
              private productService: ProductService, private route:Router) {
    this.numberOfCartItems$ = cartService.findCart().pipe(map(cart=>cart.items.length),catchError(err=> of(0)));
    this.categories$ = this.productService.findAllProductCategories().pipe(map(categories=> categories.slice(0,4)),shareReplay(1));
    this.brands$ = this.productService.findAllProductBrands().pipe(map(brands=>brands.slice(0,5)),shareReplay(1));
  }

  ngOnInit() {
    this.auth.onAuthStateChanged({
      next:user=>{
        this.user = user;
      },
      error:err=> console.log(err),
      complete: ()=> console.log('Auth state change completed')
    });

    // this.isLoggedIn = this.user != null
    //this.loginService.setTest();
    // this.user$ = this.loginService.user;
    // this.isLoggedIn$.subscribe(res=>console.log(res));
    // this.isLoggedIn$ = this.loginService.isLoggedIn;

  }

  closeNav(){
    this.isCollapsed = !this.isCollapsed;
  }

  // logout() {
  //   NotificationToast.fire({
  //     icon: 'success',
  //     title: 'Logged out successfully'
  //   }).then(result => {
  //     if(result.isDismissed){
  //       this.userService.logout();
  //     }
  //   });
  // }
  logout() {
    this.loginService.logout().then(res=>{
      this.router.navigate(['']).then(res => {
        location.reload()
      });
    },error=>console.log(error));
  }

  protected readonly close = close;
  protected readonly faHeart = faHeart;

  openMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  showMegaMenu(name:string) {

    switch (name){
      case 'MEN':
        this.isMenMegaMenuOpen = true;
        this.isWomenMegaMenuOpen = false;
        break;
      case 'WOMEN':
        this.isMenMegaMenuOpen = false;
        this.isWomenMegaMenuOpen = true;
    }
  }

  showMobileMenuTab(name:string){
    switch(name){
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


  addCategoryFilter(category:Category) {
    this.productService.setBrandFilter(null);
    this.isProductMegaMenuOpen = false;
    this.productService.setCategoryFilter(category);
  }

  addBrandFilter(brand: Brand){
    this.productService.setCategoryFilter(null);
    this.isProductMegaMenuOpen = false;
    this.productService.setBrandFilter(brand);
  }
}
