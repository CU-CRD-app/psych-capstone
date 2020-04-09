import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { timer } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Events } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

enum Popup { NULL, HOME, LOGIN, REGISTER, WHY, INVALID }
enum BadMsg { DEFAULT, NO_ACCOUNT, LOGINFORM, EMPTYSELECTIONS, 
              PASSMISMATCH, BADREGISTER, REG_HTTP_ERROR, REGISTERED }

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() finished = new EventEmitter<void>();

  public loginForm : FormGroup;
  public registerForm : FormGroup;

  private debugMode: boolean = true;

  constructor(public formBuilder : FormBuilder, public events : Events, public http : HttpClient) {

    this.loginForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])]
    });

    this.registerForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      password_check: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      race: ['', Validators.compose([Validators.required])],
      nationality: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      age: ['', Validators.compose([Validators.required])]
    }, {validator: LoginComponent.registerFormCheck});

  }

  ngOnInit() {
    timer(1000).subscribe(()=>(this.popup = Popup.HOME));
  }

  Popup = Popup;
  BadMsg = BadMsg;
  popup : Popup = Popup.NULL;
  badmsg : BadMsg = BadMsg.DEFAULT;

  login : string = "assets/icon/log-in.svg";
  help : string = "help-circle-outline";

  base_url : string = "https://crossfacerecognition.herokuapp.com/";
  login_url : string = this.base_url + "login/";
  register_url : string = this.base_url + "register/";

  Login() {
    this.popup = Popup.LOGIN;
  }

  SubmitLogin() {
    if (this.loginForm.invalid) {
      this.popup = Popup.INVALID;
      this.badmsg = BadMsg.LOGINFORM;
      return;
    }
    else {
      let username = this.loginForm.value.username;
      let password = this.loginForm.value.password;
      let logJSON = {Username: username, Password: password};
      console.log("Login JSON: ", JSON.stringify(logJSON));

      let body = {
        "email": username,
        "password": password
      };
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8'
        })
      };

      this.http.post(this.login_url, body, {headers: httpOptions}).subscribe((response) => {
        console.log(response);
        this.events.publish('loggedin', username);
        this.finished.emit();

      }, (err) => {
        this.popup = Popup.INVALID;
        this.badmsg = BadMsg.NO_ACCOUNT;
      });
    }
  }

  Register() {
    this.popup = Popup.REGISTER;
  }

  SubmitRegister() {
    if (this.registerForm.hasError('empty responses')) {
      this.popup = Popup.INVALID;
      this.badmsg = BadMsg.EMPTYSELECTIONS;
      return;
    }
    else if (this.registerForm.hasError('password mismatch')) {
      this.popup = Popup.INVALID;
      this.badmsg = BadMsg.PASSMISMATCH;
      return;
    }
    else if (this.registerForm.invalid) {
      this.popup = Popup.INVALID;
      this.badmsg = BadMsg.BADREGISTER;
      return;
    }
    else {
      let email = this.registerForm.value.username;
      let password = this.registerForm.value.password;
      let race = this.registerForm.value.race;
      let nationality = this.registerForm.value.nationality;
      let gender = this.registerForm.value.gender;
      let age = this.registerForm.value.age;

      let regJSON = {Username: this.registerForm.value.username, Password: this.registerForm.value.password, 
                     Race: this.registerForm.value.race, Nationality: this.registerForm.value.nationality,
                     Gender: this.registerForm.value.gender, Age: this.registerForm.value.age};
      console.log("Register JSON: ", JSON.stringify(regJSON));

      let body = {
        "email": email,
        "password": password,
        "race": race,
        "nationality": nationality,
        "gender": gender,
        "age": age
      };
      let httpOptionsReg = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8'
        })
      };

      this.http.put(this.register_url, body, {headers: httpOptionsReg}).subscribe((response) => {
        console.log(response);
        this.popup = Popup.INVALID;
        this.badmsg = BadMsg.REGISTERED;
      }, (err) => {
        this.popup = Popup.INVALID;
        this.badmsg = BadMsg.REG_HTTP_ERROR;
      });

    }
  }

  Why() {
  	this.popup = Popup.WHY;
  }

  BackHome() {
    this.popup = Popup.HOME;
  }

  TryAgain() {
    this.popup = Popup.HOME;
  }

  TryLoginAgain() {
    this.popup = Popup.LOGIN;
  }

  static registerFormCheck(regForm: FormGroup): any {
    let pwd1 = regForm.get('password');
    let pwd2 = regForm.get('password_check');
    let age = regForm.value['age'];
    let race = regForm.value['race'];
    let nationality = regForm.value['nationality'];
    let gender = regForm.value['gender'];

    if (race == '' || nationality == '' || gender == '') {
      return {
        "empty responses" : true
      }
    }
    
    if (pwd1.value != pwd2.value) {
      return {
        "password mismatch" : true
      };
    } 

    else if (age < 0 || age > 105) {
      return {
        "invalid age" : true
      };
    } 

    else {
      return null;
    }
  }
}
