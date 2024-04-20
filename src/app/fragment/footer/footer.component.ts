import { Component, OnInit } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faFacebook, faWhatsapp, faTiktok, faShopify} from "@fortawesome/free-brands-svg-icons"

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [
    FaIconComponent
  ],
  standalone: true
})
export class FooterComponent implements OnInit {

  faFacebook = faFacebook;
  faWhatsapp = faWhatsapp;
  faTiktok = faTiktok;
  faShopee = faShopify;
  constructor() { }

  ngOnInit(): void {
  }

}
