import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage {

  constructor(public alertController : AlertController, public events: Events) {
    // set login creds
    events.subscribe('loggedin', (username) => {
      this.username = username;
    });
  }

  ngAfterViewInit() {
    this.viewReady = true;
  }

  viewReady : boolean = false;
  loggedIn : boolean = false;

  username : string = 'USERNAME'
  level : number = 1;
  progressToday : number = 0.5;

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
