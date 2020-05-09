import { Component } from '@angular/core';
import { Events, ToastController } from '@ionic/angular';
import { GetProgressService } from '../service/get-progress.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { timer } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage {

  constructor(public getProgress: GetProgressService, public events: Events, public toastController: ToastController, public localNotifications: LocalNotifications) {}

  ngOnInit() {
    this.localNotifications.requestPermission();
  }

  ionViewWillEnter() {

    this.waitingForResponse = true;

    timer(1000).subscribe(() => {

      this.getProgress.getData().subscribe((res) => {

        this.days = res['days'];
        this.level = res['level'];
        let today = new Date().toLocaleDateString();
        let lastDay = '';
        for (let day in this.days) {
          if ([this.days[day]['nameface'], this.days[day]['whosnew'], this.days[day]['memory'], this.days[day]['shuffle'], this.days[day]['forcedchoice'], this.days[day]['samedifferent']].indexOf(-1) < 0) {
            lastDay = new Date(this.days[day]['date']).toLocaleDateString();
          }
        }
        if (this.level > 0 && this.level < 9) {
          if (today == lastDay) {
            this.progressToday = 1;
          } else {
            this.progressToday = 0;
            if (this.days[this.level - 1]) {
              if (this.days[this.level - 1].nameface >= 6) {
                this.progressToday++;
              }
              if (this.days[this.level - 1].whosnew >= 6) {
                this.progressToday++;
              }
              if (this.days[this.level - 1].memory >= 24) {
                this.progressToday++;
              }
              if (this.days[this.level - 1].shuffle >= 12) {
                this.progressToday++;
              }
              if (this.days[this.level - 1].forcedchoice >= 6) {
                this.progressToday++;
              }
              if (this.days[this.level - 1].samedifferent >= 6) {
                this.progressToday++;
              }
            }
            this.progressToday = parseFloat((this.progressToday / 6).toFixed(2));
          }
        }

        this.progressOverall = this.level / 10;

        this.waitingForResponse = false;

      }, async (err) => { 
        const toast = await this.toastController.create({
          message: 'Something went wrong. Please try logging out and back in',
          color: 'danger',
          duration: 2000
        });
        toast.present();
      });

    });

  }

  level : number;
  days : any;
  progressToday : number;
  progressOverall : number;
  waitingForResponse : boolean;

}
