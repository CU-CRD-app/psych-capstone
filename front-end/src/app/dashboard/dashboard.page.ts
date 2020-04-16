import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { GetProgressService } from '../service/get-progress.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage {

  constructor(public alertController : AlertController, public getProgress: GetProgressService, public events: Events) {
    // set login creds
    events.subscribe('loggedin', (username) => {
      this.username = username;
    });

    events.subscribe('dashLevel', (black_lvl, asian_lvl) => {
      this.level = black_lvl;
    });

  }

  ngOnInit() {
    this.getProgress.dashLevel();
  }

  ngAfterViewInit() {
    this.viewReady = true;
  }

  viewReady : boolean = false;
  loggedIn : boolean = true;

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
