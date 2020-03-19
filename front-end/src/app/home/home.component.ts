import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { timer } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


enum Popup { NULL, HOME, LOGIN, REGISTER, WHY }

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Output() finished = new EventEmitter<void>();

  public loginForm : FormGroup;
  public registerForm : FormGroup;

  private debugMode: boolean = true;

  constructor(public formBuilder : FormBuilder) {

    this.loginForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])]
    });

    this.registerForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
      password_check: ['', Validators.compose([Validators.required])]
    }, {validator: HomeComponent.passwordsMatch});

  }

  ngOnInit() {
    timer(1000).subscribe(()=>(this.popup = Popup.HOME));
  }

  Popup = Popup;
  popup : Popup = Popup.NULL;

  login : string = "/assets/icon/log-in.svg";
  help : string = "help-circle-outline";

  Login() {
    this.popup = Popup.LOGIN;
  }

  SubmitLogin() {
    if (this.loginForm.invalid) {
      alert("Invalid username (email) or password");
      return;
    }
    else {
      let logJSON = {Username: this.loginForm.value.username, Password: this.loginForm.value.password};
      console.log("Login JSON: ", JSON.stringify(logJSON));
      this.finished.emit();
    }
  }

  Register() {
    this.popup = Popup.REGISTER;
  }

  SubmitRegister() {
    if (this.registerForm.invalid || this.registerForm.hasError('password mismatch')) {
      alert("Username must be valid email, passwords must match");
      return;
    }
    else {
      let regJSON = {Username: this.registerForm.value.username, Password: this.registerForm.value.password};
      console.log("Register JSON: ", JSON.stringify(regJSON));
      this.finished.emit();
    }
  }

  Why() {
  	this.popup = Popup.WHY;
  }

  BackHome() {
    this.popup = Popup.HOME;
  }

  static passwordsMatch(regForm: FormGroup): any {
    let pwd1 = regForm.get('password');
    let pwd2 = regForm.get('password_check');
    if (pwd1.value != pwd2.value) {
      return {
        "password mismatch" : true
      };
    return null;
    }
  }
}
