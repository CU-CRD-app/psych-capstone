import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

enum Task { LEARNING, NAME_FACE, WHOS_NEW, MEMORY, SHUFFLE, FORCED_CHOICE, SAME_DIFFERENT }

const slideValues = {
  'Meet Today\'s Faces': [
    ['assets/help-slides/learning/0.png', 'You will be shown eight faces and their names. Memorize the name-face pairs, as they will be the basis of your daily training.'],
    ['assets/help-slides/learning/1.png', 'caption1']],
  'Name and Face': [['assets/help-slides/learning/0.png', 'caption0'], ['assets/help-slides/learning/1.png', 'caption1']],
  'Who\'s New?': [['assets/help-slides/learning/0.png', 'caption0'], ['assets/help-slides/learning/1.png', 'caption1']],
  'Memory Match': [['assets/help-slides/learning/0.png', 'caption0'], ['assets/help-slides/learning/1.png', 'caption1']],
  'Shuffle': [['assets/help-slides/learning/0.png', 'caption0'], ['assets/help-slides/learning/1.png', 'caption1']],
  'Forced Choice': [['assets/help-slides/learning/0.png', 'caption0'], ['assets/help-slides/learning/1.png', 'caption1']],
  'Same-Different': [['assets/help-slides/learning/0.png', 'caption0'], ['assets/help-slides/learning/1.png', 'caption1']]
}

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss'],
})
export class HelpModalComponent implements OnInit {

  constructor(private modalController: ModalController, private navParams: NavParams) { }

  ngOnInit() {
    this.slides = slideValues[this.navParams.data.paramTask];
  }

  Task = Task;
  task : Task;

  slides : string[][];
  currentSlide : number = 0;

  async closeModal() {
    await this.modalController.dismiss();
  }

}
