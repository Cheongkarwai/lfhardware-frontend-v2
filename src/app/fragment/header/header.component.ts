import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  faBars = faBars
  hidden = true;

  @Output()
  toggleMenu = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  toggle(){
    this.hidden = !this.hidden;
    this.toggleMenu.emit(this.hidden);
  }

}
