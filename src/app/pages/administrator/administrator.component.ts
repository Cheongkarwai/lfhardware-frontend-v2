import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {SidebarComponent} from "../../fragment/sidebar/sidebar.component";
import {HeaderComponent} from "../../fragment/header/header.component";

@Component({
  selector: 'app-administrator',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './administrator.component.html',
  styleUrl: './administrator.component.scss'
})
export class AdministratorComponent implements OnInit{
  hidden:boolean = true;
  loading = false;
  constructor(private router:Router) {
    // this.router.events.subscribe(res=>{
    //   if(res instanceof NavigationStart){
    //     this.loading = true;
    //   }
    //   else if(res instanceof NavigationError || res instanceof NavigationEnd || res instanceof NavigationCancel){
    //     this.loading = false;
    //   }
    // })
  }

  ngOnInit(): void {
  }
  // closeNav(){
  //   this.hidden = !this.hidden;
  // }

  toggleMenu(value:boolean){
    this.hidden = value;
  }

}
