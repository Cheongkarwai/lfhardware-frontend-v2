import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment.development";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Image} from "./image.interface";
import {FormControl} from "@angular/forms";
import {DocumentAndCredentialsForm} from "../service-provider/service-provider-signup.service";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private readonly url = `${environment.api_url}/files`;

  constructor(private httpClient: HttpClient) {
  }

  uploadProductFiles(displayProduct: File, productDetailsShowcase: File[]) {
    const formData = new FormData();
    formData.set('product_image', displayProduct);
    for (const productDetailsImage of productDetailsShowcase) {
      formData.append('product_details_images', productDetailsImage);
    }

    return this.httpClient.post<Image[]>(`${this.url}/products/upload`, formData);
  }

  uploadServiceProviderDocuments(document: DocumentAndCredentialsForm) {
    const formData = new FormData();
    formData.append('front_identity_card', document.front_identity_card);
    formData.set('back_identity_card', document.back_identity_card);
    formData.set('ssm', document.ssm);
    return this.httpClient.post<Image[]>(`${this.url}/service-providers/documents/upload`, formData);
  }

  downloadImage(url: string) {
    this.httpClient.get(url, {responseType: 'blob'}).subscribe(blob => {
      // Create a link element
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'CoverImage.jpg'; // Set the download filename

      // Append link to the body, click it, and then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, error => {
      console.error('Error downloading the image: ', error);
    });
  }

  uploadCompleteAppointmentEvidence(id: string, serviceId: number, serviceProviderId: string, customerId: string, createdAt: Date, evidences: File[]) {
    const formData = new FormData();
    for(const file of evidences){
      formData.append('evidences', file);
    }
    return this.httpClient.post<Image[]>(`${this.url}/appointments/${id}/${serviceId}/${serviceProviderId}/${customerId}/${createdAt}/evidences/upload`, formData);
  }
}
