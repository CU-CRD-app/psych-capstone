import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Output() finished = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

  login_popup : boolean = false;
  register_popup : boolean = false;
  msg : string;

  Login() {
  	this.finished.emit();
  }

  Register() {

  }

  Why() {
  	this.msg = "Thank you for downloading our app, we know it can be annoying to have to make\
  	a new account, but we hope you will consider doing so. The CU Psychology Department is\
  	using anonymous data gathered by the app to research Cross-Race-Recognition Deficit, and\
  	that data is only gatherable if you make an account. Thanks!"
  	alert(msg);
  }
}
