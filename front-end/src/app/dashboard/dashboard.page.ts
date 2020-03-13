import { Component, ViewChildren } from '@angular/core';
import { TrainingPage } from '../training/training.page';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage {
  @ViewChildren('training') tabRef: TrainingPage;

  constructor(public alertController : AlertController) {}

  ngAfterViewInit() {
    this.viewReady = true;
  }

  viewReady : boolean = false;
  loggedIn : boolean = false;

  username : string = 'USERNAME'
  level : number = 1;
  progressToday : number = 0.5;
  
  inTraining() {
    if (this.viewReady) {
      return this.tabRef.stage != this.tabRef.Stage.START && this.tabRef.stage != this.tabRef.Stage.DONE;
    }
  }

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
