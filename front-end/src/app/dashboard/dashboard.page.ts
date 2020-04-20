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

  constructor(public alertController : AlertController, public getProgress: GetProgressService, public events: Events, public nativeStorage: NativeStorage) {
    // set login creds

    // events.subscribe('dashLevel', (black_lvl, asian_lvl) => {
    //   this.level = black_lvl;
    // });
  }

  ngOnInit() {
    //this.getProgress.dashLevel();

    this.nativeStorage.getItem("level")
      .then(
        data => {
          this.level = data;
        },
        error => {
          console.log(error);
        }
      );

    this.nativeStorage.getItem("username")
      .then(
        data => {
          this.username = data;
        },
        error => {
          console.log(error);
        }
      );

   // this.nativeStorage.getItem("log_JSON")
   //   .then(
   //     data=>{
   //       this.json = JSON.stringify(data);
   //     },
   //     err => {
   //       console.log(err);
   //     }
   //   );
   // this.nativeStorage.getItem("token")
   //   .then(
   //     data=>{
   //       this.token = JSON.stringify(data);
   //     },
   //     err => {
   //       console.log(err);
   //     }
   //   );
   // this.nativeStorage.getItem("days").then(data=>{this.days = JSON.stringify(data);});
  }

  ngAfterViewInit() {
    this.viewReady = true;
  }

  viewReady : boolean = false;
  loggedIn : boolean = false;

  username : string = 'USERNAME'
  level : number = 1;
  progressToday : number = 0.5;

  //testing
  // json : any;
  // token : any;
  // days : any;


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
