import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { timer } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

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

  constructor(public formBuilder : FormBuilder, public http : HttpClient, public nativeStorage : NativeStorage) {

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

  Bypass() {
    this.finished.emit();
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

      // let myHeader = new HttpHeaders(
      //   {'Content-Type': 'application/json; charset=utf-8'});
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      this.http.post(this.login_url, body, options).subscribe((response: Response) => {
        // console.log(response);
        // console.log(response['token']);
        // console.log(response['days']);
        // console.log(response['level']);
        this.nativeStorage.setItem("log_JSON", response)
          .then(
            () => console.log("log_JSON stored"),
            error => console.log("Error storing entire log_JSON: ", error)
          );
        this.nativeStorage.setItem("token", response["token"])
          .then(
            () => console.log("token stored"),
            error => console.log("Error storing token: ", error)
          );
        this.nativeStorage.setItem("days", response["days"])
          .then(
            () => console.log("days stored"),
            error => console.log("Error storing days array: ", error)
          );
        //not implemented yet on backend:
        this.nativeStorage.setItem("level", response["level"])
          .then(
            () => console.log("stored level"),
            error => console.log("Error storing level: ", error)
          );
        // this.nativeStorage.setItem("pre", response["pre"])
        //   .then(error => console.log("Error storing pre: ", error));
        // this.nativeStorage.setItem("post", response["post"])
        //   .then(error => console.log("Error storing post: ", error));
        this.nativeStorage.setItem("username", username)
          .then(
            () => console.log('Stored username as: ', username),
            error => console.log('Error storing username:', error)
          );
        this.finished.emit();

      }, (err) => {
        console.log(err);
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

      console.log("Register JSON: ", JSON.stringify(body));

      this.http.put(this.register_url, body, httpOptionsReg).subscribe((response: Response) => {
        console.log(response);
        console.log(response.body);
        //upon naming the popups and "BadMsg" earlier, I didn't plan on
        // this functionality, hence the poor names, sorry.
        // the two lines below tell the user they were successfully
        // registered and to go log in now.
        this.popup = Popup.INVALID;
        this.badmsg = BadMsg.REGISTERED;
      }, (err) => {
        console.log(err);
        if (err.error == "Email already used") {
          console.log("Email already used");
        }
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
