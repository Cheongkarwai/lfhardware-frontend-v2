// import {Component, Input, OnInit} from '@angular/core';
// import {MatIconRegistry} from "@angular/material/icon";
// import {Property} from "../../core/property/property.interface";
// import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
//
// @Component({
//   selector: 'app-property-card',
//   templateUrl: './property-card.component.html',
//   styleUrls: ['./property-card.component.css']
// })
// export class PropertyCardComponent implements OnInit {
//   images!:SafeUrl[] ;
//
//   @Input()  property! :Property;
//   constructor(private sanitizer:DomSanitizer) {
//   }
//
//   ngOnInit(): void {
//     this.images = this.property.files.map(e=>this.sanitizer.bypassSecurityTrustUrl("/images"+e));
//   }
//
//   contact(method: string) {
//     console.log(method);
//     switch(method){
//       case 'whatsapp':
//         window.open('https://wa.me/01128188291')
//         break;
//
//       case 'facebook':
//         window.open('https://m.me/张家威');
//
//         break;
//     }
//   }
// }
