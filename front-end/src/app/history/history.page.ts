import { Component, ViewChild } from '@angular/core';
import { IonSlides, ToastController } from '@ionic/angular';
import { GetProgressService } from '../service/get-progress.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss']
})
export class HistoryPage {
  @ViewChild('slideElement', {static: false}) slideElement: IonSlides;
  @ViewChild('rangeElement', {static: false}) rangeElement: IonSlides;

  constructor(public toastController : ToastController, public getProgress : GetProgressService) {}

  ngOnInit() {}

  ionViewWillEnter() {

    this.waitingForResponse = true;

    timer(1000).subscribe(() => {

      this.getProgress.getData().subscribe((res) => {

        for (let i : number = 0; i < res['days'].length; i++) {
          if (res['days'][i]['nameface'] != -1 && res['days'][i]['whosnew'] != -1 && res['days'][i]['memory'] != -1 && res['days'][i]['shuffle'] != -1 && res['days'][i]['forcedchoice'] != -1 && res['days'][i]['samedifferent'] != -1) {
            this.days[i] = res['days'][i];
            this.days[i]['date'] = new Date(this.days[i]['date']).toLocaleDateString();
          }
        }

        this.level = res['level']
        if (this.level > 0) {
          this.level--;
        }

        if (res['pre']['score']) {
          this.pre_post[0] = {score: res['pre']['score'], date: new Date(res['pre']['date']).toLocaleDateString()};
        }
        if (res['post']['score']) {
          this.pre_post[1] = {score: res['post']['score'], date: new Date(res['post']['date']).toLocaleDateString()};
        }

        this.waitingForResponse = false;
        timer(1000).subscribe(() => {this.slide(this.level)})

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

  days : any = [{}, {}, {}, {}, {}, {}, {}, {}];
  pre_post : any = [{}, {}];
  currentCard : number = 0;
  level : number;
  waitingForResponse : boolean;

  async slide(index: number) {
    await this.slideElement.slideTo(index);
  }

  async setCurrent() {
    this.currentCard = await this.slideElement.getActiveIndex();
  }

}
