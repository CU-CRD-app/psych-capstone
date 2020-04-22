import { Component, OnInit, ViewChild } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-history-comp',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  @ViewChild('slideElement', {static: false}) slideElement: IonSlides;
  @ViewChild('rangeElement', {static: false}) rangeElement: IonSlides;

  constructor(public nativeStorage : NativeStorage) {}

  ngOnInit() {
    this.days = [{}, {}, {}, {}, {}, {}, {}, {}];
    this.pre_post = [{}, {}];
    this.currentCard = 0;

    this.nativeStorage.getItem("days").then((data) => {
      let days = JSON.stringify(data);
      for (let i : number = 0; i < this.days.length; i++) {
        this.days[i] = days[i];
      }
    });
  }

  days : any;
  pre_post : any;
  currentCard : number;

  async slide(index: number) {
    await this.slideElement.slideTo(index);
  }

  async setCurrent() {
    this.currentCard = await this.slideElement.getActiveIndex();
  }

}
