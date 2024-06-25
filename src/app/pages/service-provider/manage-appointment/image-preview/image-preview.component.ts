import {Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AppointmentTable} from "../../../../core/appointment/appointment-table.interface";
import {SwiperOptions} from "swiper/types";
import {SwiperDirective} from "../../../../core/directive/swiper.directive";
import {register} from "swiper/element/bundle";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-image-preview',
  standalone: true,
  imports: [CommonModule,SwiperDirective],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImagePreviewComponent implements OnInit{

  public config: SwiperOptions = {
    autoHeight:true,
    navigation: true,
    pagination: {clickable: true, dynamicBullets: true},
    slidesPerView: "auto",
    effect:'coverflow',
    allowTouchMove:false,
    autoplay:false,
    // breakpoints: {
    //   '480': {
    //     autoHeight: true,
    //     navigation: true,
    //     pagination: {clickable: true, dynamicBullets: true},
    //     slidesPerView: "auto",
    //     effect:'coverflow',
    //     allowTouchMove:false,
    //     autoplay:false,
    //     spaceBetween: 1,},
    // },


  };
  images: string [] = [];
  constructor(public dialogRef: MatDialogRef<ImagePreviewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { images: string[] }) {
    this.images = this.data.images;
  }

  ngOnInit() {
    register();
  }

  changeSource(event: any) {
    event.target.src = 'https://placehold.co/800?text=Image+Not+Found&font=roboto';
  }
}
