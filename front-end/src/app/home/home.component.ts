import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { timer } from 'rxjs';

enum Popup { NULL, HOME, LOGIN, REGISTER, WHY }

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Output() finished = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
    timer(1000).subscribe(()=>(this.popup = Popup.HOME));
  }

  Popup = Popup;
  popup : Popup = Popup.NULL;

  login : string = "assets/icon/log-in.svg";
  help : string = "help-circle-outline";

  Login() {
    this.popup = Popup.LOGIN;
  }

  SubmitLogin() {
    this.finished.emit();
  }

  Register() {
    this.popup = Popup.REGISTER;
  }

  SubmitRegister() {
    this.finished.emit();
  }

  Why() {
  	this.popup = Popup.WHY;
  }

  BackHome() {
    this.popup = Popup.HOME;
  }
}
