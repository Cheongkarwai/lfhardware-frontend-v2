import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {FormDTO} from "./form-dto.interface";
import {Service} from "../service-provider/service.interface";

@Injectable({
  providedIn: 'root'
})
export class FormService {

  configuration$: BehaviorSubject<{ elements: any[] }> = new BehaviorSubject<any>({elements: []});

  private readonly url = `${environment.api_url}/forms`;

  constructor(private httpClient: HttpClient) {
  }

  createJsonForm(type: string, label: string, index: number) {
    if (type === 'text') {
      return {
        type: type,
        label: label,
        name: 'formControl' + index,
        value: ''
      };
    } else if (type === 'number') {
      return {
        type: type,
        label: label,
        name: 'formControl' + index,
        value: 0
      };
    }
    return {};
  }


  createRadioButton(properties: {
    name: string,
    title: string,
    isRequired: boolean,
    requiredErrorText: string,
    choices: { text: string, value: string }[]
  }) {
    const element = this.configuration$.getValue();
    element.elements.push({
      type: "radiogroup",
      name: properties.name,
      title: properties.title,
      isRequired: properties.isRequired,
      requiredErrorText: properties.requiredErrorText,
      colCount: 1,
      choices: properties.choices,
      separateSpecialChoices: true,
      showClearButton: true
    });
    this.configuration$.next(element);
  }

  createInputText(properties: { name: string, title: string, isRequired: boolean, requiredErrorText: string }) {
    const element = this.configuration$.getValue();
    element.elements.push({
      type: "text",
      name: properties.name,
      title: properties.title,
      isRequired: properties.isRequired,
      requiredErrorText: properties.requiredErrorText
    });
    this.configuration$.next(element);
  }

  get formConfigurationObs() {
    return this.configuration$.asObservable();
  }

  createDate(properties: { name: string, title: string, isRequired: boolean, requiredErrorText: string }) {
    const element = this.configuration$.getValue();
    element.elements.push({
      name: properties.name,
      title: properties.title,
      type: 'text',
      inputType: 'date',
      isRequired: properties.isRequired,
      requiredErrorText: properties.requiredErrorText
    })
    this.configuration$.next(element);
  }

  findFormConfiguration(serviceProviderId: number, serviceId: number) {
    return this.httpClient.get<FormDTO>(`${this.url}/quote-form/service-providers/${serviceProviderId}/services/${serviceId}`);
  }

  createCheckbox(properties: {
    name: string,
    title: string,
    isRequired: boolean,
    requiredErrorText: string,
    choices: { text: string, value: string }[]
  }) {
    const element = this.configuration$.getValue();
    element.elements.push({
      type: "checkbox",
      name: properties.name,
      title: properties.title,
      isRequired: properties.isRequired,
      requiredErrorText: properties.requiredErrorText,
      colCount: 1,
      choices: properties.choices,
      separateSpecialChoices: true,
      showClearButton: true
    });
    this.configuration$.next(element);
  }

  createDatetime(properties: { name: string, title: string, isRequired: boolean, requiredErrorText: string }) {
    const element = this.configuration$.getValue();
    element.elements.push({
      name: properties.name,
      title: properties.title,
      type: 'text',
      inputType: 'datetime',
      isRequired: properties.isRequired,
      requiredErrorText: properties.requiredErrorText
    })
    this.configuration$.next(element);
  }

  saveQuoteForm(value: { elements: any[] }, service: Service | null) {
    return this.httpClient.post<{ elements: any[] }>(`${this.url}/quote-form`, {
      form: value,
      service_id: service?.id,
      service_provider_id: 69
    });
  }
}
