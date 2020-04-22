import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { GetProgressService } from '../service/get-progress.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage {

  constructor(public alertController : AlertController, public getProgress: GetProgressService, public events: Events, public nativeStorage: NativeStorage) {}

  ngOnInit() {

    this.nativeStorage.getItem("level")
      .then(
        data => {
          this.level = data;
        },
        error => {
          console.log(error);
        }
      );

    this.nativeStorage.getItem("days")
      .then(
        data => {
          this.days = data;
        },
        error => {
          console.log(error);
        }
      );

    this.progressToday = 0;
    if (this.days[this.level]) {
      if (this.days[this.level].nameface >= 6) {
        this.progressToday++;
      }
      if (this.days[this.level].whosnew >= 6) {
        this.progressToday++;
      }
      if (this.days[this.level].memory >= 24) {
        this.progressToday++;
      }
      if (this.days[this.level].shuffle >= 12) {
        this.progressToday++;
      }
      if (this.days[this.level].forcedchoice >= 6) {
        this.progressToday++;
      }
      if (this.days[this.level].samedifferent >= 6) {
        this.progressToday++;
      }
      this.progressToday /= 6;
    }
  }

  ngAfterViewInit() {
    this.viewReady = true;
  }

  viewReady : boolean = false;
  loggedIn : boolean = true;

  level : number = 0;
  days : any = [];
  progressToday : number = 0;

  async logoutAlert() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Do you want to logout?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Logout',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  logout() {
    this.loggedIn = false;
  }
}
