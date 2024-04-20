import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Image} from "./image.interface";
import {FormControl} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class FileService{

  private readonly url  = `${environment.api_url}/files`;

  constructor(private httpClient: HttpClient) {
  }

  uploadProductFiles(displayProduct: File, productDetailsShowcase: File[]){
    const formData = new FormData();
    formData.set('product_image', displayProduct);
    for(const productDetailsImage of productDetailsShowcase){
      formData.append('product_details_images', productDetailsImage);
    }

    return this.httpClient.post<Image[]>(`${this.url}/products/upload`, formData);
  }
}
