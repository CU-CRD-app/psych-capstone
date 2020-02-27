import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Output() finished = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
    timer(1000).subscribe(()=>(this.home_popup = true))
  }

  home_popup : boolean = false;
  login_popup : boolean = false;
  register_popup : boolean = false;
  why_popup : boolean = false;
  msg : string;
  login : string = "/assets/icon/log-in.svg";
  help : string = "help-circle-outline";

  Login() {
    this.home_popup = false;
    this.login_popup = true;
  }

  SubmitLogin() {
    this.finished.emit();
  }

  Register() {
    this.home_popup = false;
    this.register_popup = true;
  }

  SubmitRegister() {
    this.finished.emit();
  }

  Why() {
  	this.home_popup = false;
    this.why_popup = true;
  }

  BackHome() {
    this.home_popup = true;
    this.login_popup = false;
    this.register_popup = false;
    this.why_popup = false;
  }
}
