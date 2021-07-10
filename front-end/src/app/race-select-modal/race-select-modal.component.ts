import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController, NavParams, IonSlides } from '@ionic/angular';
const raceValues = ['Asian', 'Black', 'Latino', 'White']

const numRaceSets = 4;

@Component({
  selector: 'app-race-select-modal',
  templateUrl: './race-select-modal.component.html',
  styleUrls: ['./race-select-modal.component.scss'],
})

export class RaceSelectModalComponent implements OnInit {
  @Input() firstDisplayed : boolean;
  @ViewChild('slideElement', {static: false}) slideElement: IonSlides;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.cards = raceValues;
    this.hideStart = true;
  }

  cards : string[];
  hideStart : boolean;
  currentRace : string;

  // async closeModal(currentRace : string) {
  async closeModal() {
    // const onClosedData: string = "Closed";
    // await this.modalController.dismiss(onClosedData);
    await this.modalController.dismiss(this.currentRace);
  }

  selectedRace(value: string) {
    this.hideStart = false;
    this.currentRace = value;
  }
}
