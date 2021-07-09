import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { TermsConditionsComponent } from '../terms-conditions/terms-conditions.component';

enum Popup { HOME, LOGIN, REGISTER, FORGOT }

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm : FormGroup;
  public registerForm : FormGroup;

  private debugMode: boolean = true;

  constructor(private router : Router, public formBuilder : FormBuilder, public http : HttpClient, public nativeStorage : NativeStorage, public toastController : ToastController, public modalController : ModalController) {

    this.loginForm = formBuilder.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(16)])]
    }, {validator: LoginPage.loginFormCheck});

    this.registerForm = formBuilder.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(16)])],
      password_check: [null, Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(16)])],
      race: [null, Validators.compose([Validators.required])],
      nationality: [null, Validators.compose([Validators.required])],
      gender: [null, Validators.compose([Validators.required])],
      age: [null, Validators.compose([Validators.required, Validators.min(18), Validators.max(100)])],
      agree: [null, Validators.compose([Validators.required])]
    }, {validator: LoginPage.registerFormCheck});

  }

  ngOnInit() {

    this.router.navigate(['/dashboard']);

    this.popup = Popup.HOME;
    this.clickedSubmit = false;
  }

  Popup = Popup;
  popup : Popup;

  awaitLoginHTTP : boolean;
  awaitRegisterHTTP : boolean;
  awaitRegisterHTTPTwo : true;
  clickedSubmit : boolean;
  termsOpened : boolean;

  login : string = "assets/icon/log-in.svg";
  help : string = "help-circle-outline";

  base_url : string = "https://crossfacerecognition.herokuapp.com/";
  login_url : string = this.base_url + "login/";
  register_url : string = this.base_url + "register/";

  nationList : string[] = ["United States of America (USA)", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic (CAR)", "Chad", "Chile", "China", "Colombia", "Comoros", "Democratic Republic of the Congo", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates (UAE)", "United Kingdom (UK)", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];
  genderList : string[] = ["Male", "Female", "Other"];
  raceList : string[] = ["Caucasian", "Black", "Hispanic", "East Asian", "South Asian", "Middle Eastern", "Pacific Islander", "American Indian/Alaska Native", "Other"]

  Login() {
    this.popup = Popup.LOGIN;
    this.resetForms();
  }

  Register() {
    this.popup = Popup.REGISTER;
    this.resetForms();
  }

  BackHome() {
    this.popup = Popup.HOME;
    this.resetForms();
  }

  ForgetPassword() {
    this.popup = Popup.FORGOT;
    this.resetForms();
  }

  SubmitLogin() {

    if (!this.awaitLoginHTTP) {

      this.clickedSubmit = true;

      if (this.loginForm.invalid) {

        this.dangerToast("Invalid email or password")
        this.resetForms();

      } else {

        let body = {
          "email": this.loginForm.value.username,
          "password": this.loginForm.value.password
        }
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8'
          }),
          responseType: 'text' as 'text'
        };
  
        this.awaitLoginHTTP = true;
        this.http.post(this.login_url, body, httpOptions).subscribe((response) => {

          /*this.nativeStorage.setItem("token", response["token"])
            .then(
              () => console.log("token stored"),
              error => console.log("Error storing token: ", error)
            );*/
          localStorage.setItem("token", response);
          localStorage.setItem("username", this.loginForm.value.username);
          this.awaitLoginHTTP = false;
          this.BackHome();
          this.router.navigate(['/dashboard']);
        }, (err) => {
          err["error"] == "Account not found" ? this.dangerToast("Invalid email or password") : this.dangerToast("Something went wrong. Please try again later");
          this.awaitLoginHTTP = false;
          this.resetForms();
        });
      }
    }
  }

  SubmitRegister() {


    if (!this.awaitRegisterHTTPTwo) {

      this.clickedSubmit = true;

      // if (this.registerForm.invalid) {

      //   this.dangerToast("Billy Bob");

      // } else {

        let body = {
          "email": this.registerForm.value.username,
          "password": this.registerForm.value.password,
          "race": this.registerForm.value.race,
          "nationality": this.registerForm.value.nationality,
          "gender": this.registerForm.value.gender,
          "age": this.registerForm.value.age,
          "question": this.registerForm.value.question,
          "agree": this.registerForm.value.agree
        }
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8'
          })
        };

        this.awaitRegisterHTTP = true;
        this.http.put(this.register_url, body, httpOptions).subscribe((response) => {
          this.awaitRegisterHTTP = false;
          this.Login();
          this.successToast("Account recovery successful!");
        }, (err) => {
          this.awaitRegisterHTTP = false;
          this.successToast("Account recovery failed!");
          this.resetForms();
        });

      // }
    }

    if (!this.awaitRegisterHTTP) {

      this.clickedSubmit = true;

      if (this.registerForm.invalid) {

        this.dangerToast("Invalid fields");

      } else {

        let body = {
          "email": this.registerForm.value.username,
          "password": this.registerForm.value.password,
          "race": this.registerForm.value.race,
          "nationality": this.registerForm.value.nationality,
          "gender": this.registerForm.value.gender,
          "age": this.registerForm.value.age,
          "question": this.registerForm.value.question,
          "agree": this.registerForm.value.agree
        }
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8'
          })
        };

        this.awaitRegisterHTTP = true;
        this.http.put(this.register_url, body, httpOptions).subscribe((response) => {
          this.awaitRegisterHTTP = false;
          this.Login();
          this.successToast("Account registration successful!");
        }, (err) => {
          this.awaitRegisterHTTP = false;
          err["error"] == "Email already used" ? this.dangerToast("Account already exists") : this.dangerToast("Something went wrong. Please try again later");
          this.resetForms();
        });

      }
    }
  }

  validEmail(email : string) {
    return /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(email);
  }

  validPassword(password : string) {
    return /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && password.indexOf(' ') < 0 && password != 'Passw0rd' && password != 'Password123';
  }

  static loginFormCheck(form: FormGroup): any {
    let email = form.get('username');
    let password = form.get('password');

    if (!/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(email.value)) {
      return { "INVALID_EMAIL" : true };
    }

    if (!(/[a-z]/.test(password.value) && /[A-Z]/.test(password.value) && /[0-9]/.test(password.value) && password.value.indexOf(' ') < 0 && password.value != 'Passw0rd' && password.value != 'Password123')) {
      return { "PASSWORD_INVALID" : true }
    }

    return null;
  }

  static registerFormCheck(form: FormGroup): any {
    let email = form.get('username');
    let password = form.get('password');
    let password_confirm = form.get('password_check');
    let race = form.value['race'];
    let nationality = form.value['nationality'];
    let gender = form.value['gender'];
    let agreement = form.value['agree'];
    let question = form.value['question'];

    if (race == '' || nationality == '' || gender == '' || question == '') {
      return { "EMPTY_RESPONSES" : true };
    }

    if (!/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(email.value)) {
      return { "INVALID_EMAIL" : true };
    }
    
    if (password.value != password_confirm.value) {
      return { "PASSWORD_MISMATCH" : true };
    }

    if (!(/[a-z]/.test(password.value) && /[A-Z]/.test(password.value) && /[0-9]/.test(password.value) && password.value.indexOf(' ') < 0 && password.value != 'Passw0rd' && password.value != 'Password123')) {
      return { "PASSWORD_INVALID" : true };
    }

    if (!(/[a-z]/.test(password_confirm.value) && /[A-Z]/.test(password_confirm.value) && /[0-9]/.test(password_confirm.value) && password_confirm.value.indexOf(' ') < 0 && password_confirm.value != 'Passw0rd' && password_confirm.value != 'Password123')) {
      return { "PASSWORD_CONFIRM_INVALID" : true };
    }

    if (!agreement) {
      return { "AGREEMENT_FALSE" : true };
    }

    return null;

  }

  resetForms() {
    this.loginForm.reset();
    this.registerForm.reset();
    this.clickedSubmit = false;
    this.termsOpened = false;
  }

  async dangerToast(toastMessage : string) {
    const toast = await this.toastController.create({
      message: toastMessage,
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }

  async successToast(toastMessage : string) {
    const toast = await this.toastController.create({
      message: toastMessage,
      color: 'success',
      duration: 2000
    });
    toast.present();
  }

  fieldNotEmpty(field : string) {
    return (field != null && field != '') || this.clickedSubmit;
  }

  async openTermsAndConditions() {
    let consent = null;
    if (this.termsOpened) {
      if (this.registerForm.value.agree) {
        consent = true;
      } else {
        consent = false;
      }
    }
    const modal = await this.modalController.create({
      component: TermsConditionsComponent,
      componentProps: {
        'consent': consent
      }
    });
    await modal.present();
    let { data } = await modal.onWillDismiss();
    this.termsOpened = true;
    if (data == true) {
      this.registerForm.get('agree').setValue(true);
    } else {
      this.registerForm.get('agree').setValue(false);
    }
  }

}