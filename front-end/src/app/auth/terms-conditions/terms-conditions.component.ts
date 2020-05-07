import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
})

export class TermsConditionsComponent implements OnInit {
  constructor(private modalController : ModalController, private navParams : NavParams) { }

  ngOnInit() {
    this.consent = this.navParams.data.consent;
  }
  
  consent : boolean;

  async closeModal(consent : boolean) {
    await this.modalController.dismiss(consent);
  }

}
