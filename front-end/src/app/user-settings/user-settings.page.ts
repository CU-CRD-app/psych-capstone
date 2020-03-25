import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {

  constructor(public toastController : ToastController) { }

  ngOnInit() {
    // set values for user here
    this.boundEmail = this.userEmail;
  }

  userEmail : string = 'placeholder@email.com'; // after connected to db delete set values
  userPassword : string = '12345678';
  placeholderPassword : string = '12345678';
  boundEmail : string;
  oldPassword : string = '';
  newPasswordFirst : string = '';
  newPasswordSecond : string = '';

  emailPattern : RegExp = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/

  editingPassword : boolean = false;
  waitingForResponse : boolean = false;

  validateEmail() {
    if (this.boundEmail != this.userEmail) {
      return this.emailPattern.test(this.boundEmail);
    }
    return null;
  }

  validatePassword() {
    // pattern?
    if (this.editingPassword) {
      return this.newPasswordFirst == this.newPasswordSecond && this.oldPassword != '' && this.newPasswordFirst != '';
    }
    return null;
  }

  formTouched() {
    return this.boundEmail != this.userEmail || this.editingPassword;
  }

  validateForm() {
    return (this.validateEmail() || this.validateEmail() == null) && (this.validatePassword() || this.validatePassword() == null) && this.formTouched();
  }

  async saveForm() {
    this.waitingForResponse = true;
    // http request to db and validate changes
    this.waitingForResponse = false;
    let errorOccured : boolean = false; // set based on http request
    if (!errorOccured) {
      this.userEmail = this.boundEmail;
      this.userPassword = this.newPasswordFirst;
      this.resetPasswordForm();
      const toast = await this.toastController.create({
        message: 'Your settings have been saved.',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: 'There was a problem saving your settings, please try again later.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
    this.oldPassword = '';
    this.newPasswordFirst = '';
    this.newPasswordSecond = '';
  }

  resetPasswordForm() {
    this.editingPassword = false;
    this.oldPassword = '';
    this.newPasswordFirst = '';
    this.newPasswordSecond = '';
  }
}