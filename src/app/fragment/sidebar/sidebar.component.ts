import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbCollapseModule} from "@ng-bootstrap/ng-bootstrap";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, NavigationEnd, Router, RouterModule} from "@angular/router";
import {initFlowbite} from "flowbite";
import {DomSanitizer} from "@angular/platform-browser";
import {LoginService} from "../../core/user/login.service";

export interface NavLink {
  title: string;
  links: { title: string, route: string }[];
  collapsed: boolean;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbCollapseModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {

  @Input() hidden: boolean = true;
  @Input() navLinks: NavLink[] = [];

  constructor(private sanitizer: DomSanitizer,
              private loginService: LoginService,
              private router: Router) {
  }

  ngOnInit(): void {
    initFlowbite();
    for (let i = 0; i < this.navLinks.length; i++) {
      this.navLinks[i].icon=this.sanitizer.bypassSecurityTrustHtml(this.navLinks[i].icon) as string;
    }
  }



  toggleNav(i: number) {
    this.navLinks[i].collapsed = !this.navLinks[i].collapsed;
  }

  close() {
    this.hidden = !this.hidden;
    for (let navLink of this.navLinks) {
      navLink.collapsed = true;
    }
  }

  open() {
    this.hidden = true;
  }

  navigate() {
    this.hidden = true;
  }

  logout() {
    this.loginService.logout().subscribe({
      next:res=>{
        window.location.href = res.headers.get('Location') as string;
        this.router.navigate(['']).then(res => {
        });
      }
    })
  }
}
