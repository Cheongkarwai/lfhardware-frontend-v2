import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {FooterComponent} from "../../fragment/footer/footer.component";
import {NgIf} from "@angular/common";
import {NavbarComponent} from "../../fragment/navbar/navbar.component";

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    NavbarComponent
  ],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss'
})
export class PublicComponent {

}
