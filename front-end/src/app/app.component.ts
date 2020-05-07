import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    public alertController : AlertController,
    public nativeStorage: NativeStorage,
    public localNotifications: LocalNotifications
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  isCurrentPage(href : string) {
    return window.location.href.indexOf(href) > -1 ? true : false;
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Logout',
          handler: () => {
            localStorage.clear();
            //this.nativeStorage.remove('token');
            this.localNotifications.cancelAll();
            this.router.navigate(['/login']);
            window.location.reload();
          }
        }
      ]
    });

    await alert.present();
  }
}
