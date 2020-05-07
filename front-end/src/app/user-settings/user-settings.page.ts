import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { interval } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {

  constructor(public toastController : ToastController, public localNotifications: LocalNotifications, private openNativeSettings: OpenNativeSettings, private http: HttpClient) { }

  ngOnInit() {
    this.userEmail = localStorage.getItem('username');
    this.boundEmail = this.userEmail;
  }

  ionViewWillEnter() {
    this.updateNotification = interval(2000).subscribe(async () => {
      this.notifications = await this.localNotifications.hasPermission();
    });
  }

  async ionViewWillLeave() {
    this.updateNotification.unsubscribe();
  }

  userEmail : string;
  placeholderPassword : string = '12345678';
  boundEmail : string;
  oldPassword : string = '';
  newPasswordFirst : string = '';
  newPasswordSecond : string = '';
  notifications : boolean;

  emailPattern : RegExp = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/

  editingPassword : boolean = false;
  waitingForResponse : boolean = false;
  updateNotification : any;

  validateEmail() {
    if (this.boundEmail != this.userEmail) {
      return this.emailPattern.test(this.boundEmail);
    }
    return null;
  }

  validatePasswords() {
    if (this.editingPassword) {
      let ret = true;
      ret = ret && this.validatePassword(this.newPasswordFirst);
      ret = ret && this.validatePassword(this.newPasswordSecond);
      ret = ret && this.validatePassword(this.oldPassword);
      return ret && this.newPasswordFirst == this.newPasswordSecond && this.oldPassword != '' && this.newPasswordFirst != '' && this.oldPassword != this.newPasswordFirst;
    }
    return null;
  }

  validatePassword(password : string) {
    return /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && password.length >= 7 && password.length <= 16 && password.indexOf(' ') < 0;
  }

  formTouched() {
    return this.boundEmail != this.userEmail || this.editingPassword;
  }

  validateForm() {
    return (this.validateEmail() || this.validateEmail() == null) && (this.validatePasswords() || this.validatePasswords() == null) && this.formTouched();
  }

  saveForm() {

    if (this.validateForm()) {

      let body = {
        "email": localStorage.getItem('username'),
        "oldpassword": this.oldPassword,
        "newpassword": this.newPasswordFirst
      }
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
      };

      this.waitingForResponse = true;
      this.http.put('https://crossfacerecognition.herokuapp.com/changepassword/', body, httpOptions).subscribe(() => {
        this.waitingForResponse = false;
        this.resetPasswordForm();
        this.successToast('Your settings have been saved');
      }, (err) => {
        this.waitingForResponse = false;
        err["error"] == "Password does not match" ? this.dangerToast("Old password incorrect") : this.dangerToast("Something went wrong. Please try again later");
      });

    } else {
      this.dangerToast('Invalid fields');
    }

  }

  resetPasswordForm() {
    this.editingPassword = false;
    this.oldPassword = '';
    this.newPasswordFirst = '';
    this.newPasswordSecond = '';
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

  openSettings() {
    this.openNativeSettings.open('application_details');
  }
}