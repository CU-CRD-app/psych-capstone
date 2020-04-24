import { Component, OnInit, ViewChild } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { IonSlides } from '@ionic/angular';
import { SubmitScoresService } from '../service/submit-scores.service';

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

    this.nativeStorage.getItem("days").then((data) => {
      let days = JSON.stringify(data);
      for (let i : number = 0; i < this.days.length; i++) {
        this.days[i] = days[i];
      }
    });
    this.nativeStorage.getItem("level").then(data => {
      this.level = data;
      if (this.level > 0) {
        this.level--;
      }
    });
  }

  ngAfterViewInit() {
    this.slide(this.level);
  }

  days : any = [{}, {}, {}, {}, {}, {}, {}, {}];
  pre_post : any = [{}, {}];;
  currentCard : number = 0;
  level : number = 0;

  async slide(index: number) {
    await this.slideElement.slideTo(index);
  }

  async setCurrent() {
    this.currentCard = await this.slideElement.getActiveIndex();
  }

}
