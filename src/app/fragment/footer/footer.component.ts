import { Component, OnInit } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faFacebook, faWhatsapp, faTiktok, faShopify} from "@fortawesome/free-brands-svg-icons"
import {TextInputComponent} from "../../components/text-input/text-input.component";
import {ButtonComponent} from "../../components/button/button.component";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [
    FaIconComponent,
    TextInputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  standalone: true
})
export class FooterComponent implements OnInit {

  faFacebook = faFacebook;
  faWhatsapp = faWhatsapp;
  faTiktok = faTiktok;
  faShopee = faShopify;

  newsLetterEmailAddress: FormControl<string | null> = new FormControl<string | null>('', Validators.required);
  constructor() { }

  ngOnInit(): void {
  }

  subscribeNewsLetter() {
    this.newsLetterEmailAddress.markAllAsTouched();
  }
}
