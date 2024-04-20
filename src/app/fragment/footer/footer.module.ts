import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {RouterModule} from "@angular/router";
import {NgbCollapseModule} from "@ng-bootstrap/ng-bootstrap";
import {FooterComponent} from "./footer.component";
import {NavbarComponent} from "../navbar/navbar.component";

@NgModule({
  declarations: [
    FooterComponent
  ],
  exports: [
    FooterComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    RouterModule,
    NgbCollapseModule
  ],
})
export class FooterModule { }
