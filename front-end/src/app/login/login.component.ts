import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

enum Popup { HOME, LOGIN, REGISTER }

let toastMessages : any = {
  default: "Something went wrong. Please try again later",
  badLogin: "Invalid username or password",
  badRegister: "Invalid fields",
  accountExists: "Account already exists",
  registerSuccess: "Account registration successful!", }

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

  constructor(public formBuilder : FormBuilder, public http : HttpClient, public nativeStorage : NativeStorage, public toastController: ToastController) {

    this.loginForm = formBuilder.group({
      username: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(5)])]
    });

    this.registerForm = formBuilder.group({
      username: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      password_check: [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      race: [null, Validators.compose([Validators.required])],
      nationality: [null, Validators.compose([Validators.required])],
      gender: [null, Validators.compose([Validators.required])],
      age: [null, Validators.compose([Validators.required, Validators.min(1), Validators.max(100)])]
    }, {validator: LoginComponent.registerFormCheck});

  }

  ngOnInit() {
    this.popup = Popup.HOME;
    this.toastMessage = toastMessages.default;
    this.clickedSubmit = false;
  }

  Popup = Popup;
  popup : Popup;
  toastMessage : string;
  awaitLoginHTTP : boolean;
  awaitRegisterHTTP : boolean;
  clickedSubmit : boolean;

  login : string = "assets/icon/log-in.svg";
  help : string = "help-circle-outline";

  base_url : string = "https://crossfacerecognition.herokuapp.com/";
  login_url : string = this.base_url + "login/";
  register_url : string = this.base_url + "register/";

  nationList : string[] = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic (CAR)", "Chad", "Chile", "China", "Colombia", "Comoros", "Democratic Republic of the Congo", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates (UAE)", "United Kingdom (UK)", "United States of America (USA)", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];
  genderList : string[] = ["Male", "Female", "Other"];
  raceList : string[] = ["Caucasian", "Black", "Hispanic", "East Asian", "South Asian", "Middle Eastern", "Pacific Islander", "American Indian/Alaska Native"]

  Login() {
    this.popup = Popup.LOGIN;
  }

  Register() {
    this.popup = Popup.REGISTER;
  }

  BackHome() {
    this.popup = Popup.HOME;
  }

  Bypass() {
    this.finished.emit();
  }

  SubmitLogin() {
    if (!this.awaitLoginHTTP) {

      this.clickedSubmit = true;
      if (this.loginForm.invalid) {
        this.toastMessage = toastMessages.badLogin;
        this.dangerToast();
      } else {
        //let logJSON = {Username: username, Password: password};
        //console.log("Login JSON: ", JSON.stringify(logJSON));

        let body = {
          "email": this.loginForm.value.username,
          "password": this.loginForm.value.password
        }
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8'
          })
        };
  
        this.awaitLoginHTTP = true;
        this.http.post(this.login_url, body, httpOptions).subscribe((response : Response) => {
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
          this.nativeStorage.setItem("username", this.loginForm.value.username)
            .then(
              () => console.log('Stored username as: ', this.loginForm.value.username),
              error => console.log('Error storing username:', error)
            );
          this.awaitLoginHTTP = false;
          this.finished.emit();
        }, (err) => {
          console.log(err)
          this.toastMessage = err.status == 403 ? toastMessages.badLogin : toastMessages.default;
          this.dangerToast();
          this.awaitLoginHTTP = false;
        });
      }
    }
  }

  SubmitRegister() {
    if (!this.awaitRegisterHTTP) {

      this.clickedSubmit = true;
      if (this.registerForm.invalid) {

        this.toastMessage = toastMessages.badRegister;
        this.dangerToast();

      } else {

        /*let regJSON = {Username: this.registerForm.value.username, Password: this.registerForm.value.password, 
                      Race: this.registerForm.value.race, Nationality: this.registerForm.value.nationality,
                      Gender: this.registerForm.value.gender, Age: this.registerForm.value.age};
        console.log("Register JSON: ", JSON.stringify(regJSON));*/

        let body = {
          "email": this.registerForm.value.username,
          "password": this.registerForm.value.password,
          "race": this.registerForm.value.race,
          "nationality": this.registerForm.value.nationality,
          "gender": this.registerForm.value.gender,
          "age": this.registerForm.value.age
        }
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8'
          })
        };

        this.awaitRegisterHTTP = true;
        this.http.put(this.register_url, body, httpOptions).subscribe((response) => {
          //console.log(response);
          this.awaitRegisterHTTP = false;
          this.Login();
          this.toastMessage = toastMessages.registerSuccess;
          this.successToast();
        }, (err) => {
          //console.log(err)
          this.awaitRegisterHTTP = false;
          this.toastMessage = err.status == 400 ? toastMessages.accountExists : toastMessages.default;
          this.dangerToast();
        });

      }
    }
  }

  static registerFormCheck(regForm: FormGroup): any {
    let pwd1 = regForm.get('password');
    let pwd2 = regForm.get('password_check');
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

    else {
      return null;
    }
  }

  resetForms() {
    this.loginForm.reset();
    this.registerForm.reset();
    this.clickedSubmit = false;
  }

  async dangerToast() {
    const toast = await this.toastController.create({
      message: this.toastMessage,
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }

  async successToast() {
    const toast = await this.toastController.create({
      message: this.toastMessage,
      color: 'success',
      duration: 2000
    });
    toast.present();
  }

  fieldNotEmpty(field : string) {
    return (field != null && field != '') || this.clickedSubmit;
  }

}
