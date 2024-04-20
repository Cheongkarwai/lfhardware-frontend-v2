import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FormService {

  configuration$: BehaviorSubject<{ elements: any[] }> = new BehaviorSubject<any>({elements: []});


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
    console.log(element);
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
}
