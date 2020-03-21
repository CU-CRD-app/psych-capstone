import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

enum Task { LEARNING, NAME_FACE, WHOS_NEW, MEMORY, SHUFFLE, FORCED_CHOICE, SAME_DIFFERENT }

const slideValues = {
  'Meet Today\'s Faces': [
    ['assets/help-slides/learning/0.png', 'Memorize the eight name-face pairs you are shown, as they will be the basis of your daily training.'],
    ['assets/help-slides/learning/1.png', 'When you have seen all eight, you can click \'Finish\' to move on to the training. You can come back to this module at any time.']
  ],
  'Name and Face': [
    ['assets/help-slides/name-face/0.png', 'For each of the names you\'ve seen before, you\'ll be asked to match the appropriate face.'],
    ['assets/help-slides/name-face/1.png', 'You\'ll get a point for each face you match correctly.'],
    ['assets/help-slides/name-face/2.png', 'Whenever you guess incorrectly, you\'ll be shown the correct answer as well as the names of the concerned faces, use this to you\'re advantage!']
  ],
  'Who\'s New?': [
    ['assets/help-slides/whos-new/0.png', 'Select the face that you haven\'t yet seen today, and that wasn\'t part of the learning task.'],
    ['assets/help-slides/whos-new/1.png', 'You\'ll get a point for each face you guess correctly.'],
    ['assets/help-slides/whos-new/2.png', 'Whenever you guess incorrectly, you\'ll be shown the correct answer.']
  ],
  'Memory Match': [
    ['assets/help-slides/memory-match/0.png', 'Click \'Reveal\' to show the faces and begin the timer.'],
    ['assets/help-slides/memory-match/1.png', 'You will have 10 seconds to memorize the placement of as many face pairs as you can.'],
    ['assets/help-slides/memory-match/2.png', 'After the timer is up, click the cards to match the pairs.'],
    ['assets/help-slides/memory-match/3.png', 'When you correctly match a pair, they will be revealed. For incorrect matches you will be deducted a small amount from your score.']
  ],
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
