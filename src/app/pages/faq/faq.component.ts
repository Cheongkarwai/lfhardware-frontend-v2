import {Component, OnInit} from '@angular/core';
import {FaqService} from "../../core/faq/faq.service";
import {Faq} from "../../core/faq/faq.interface";
import {map, Observable} from "rxjs";
import {CommonModule} from "@angular/common";
import {LoadingSpinnerComponent} from "../../components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit {

  faqs$!: Observable<Faq[]>;

  collapseHidden: boolean[] = [];

  constructor(private faqService: FaqService) {
  }

  ngOnInit() {

    this.faqs$ = this.faqService.findAll()
      .pipe(map(faqs => {
        faqs.forEach(faq => this.collapseHidden.push(true));
        return faqs;
      }));
  }



  toggleCollapse(i: number) {
    this.collapseHidden[i] = !this.collapseHidden[i];
  }
}
