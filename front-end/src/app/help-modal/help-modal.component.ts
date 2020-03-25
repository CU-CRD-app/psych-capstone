import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { createAnimation } from '@ionic/core';

const slideValues = {
  'Start': [
    ['assets/help-slides/start/0.png', 'Welcome to your CRD training. Please take a minute to review these slides and familiarize yourself with the training process.'],
    ['assets/help-slides/start/1.png', 'There are eight levels to complete, each more difficult than the last. You should complete one level per day.'],
    ['assets/help-slides/start/2.png', 'For each level you will complete a learning task to familiarize yourself with the day\'s faces, then four training tasks.'],
    ['assets/help-slides/start/3.png', 'After the training tasks have been passed, you will complete two assessment tasks to judge your progress. Your level will increase after the assessment.'],
    ['assets/help-slides/start/4.png', 'Before the first level and after the last level you will complete an additional assessment to judge how much you have progressed.'],
    ['assets/help-slides/start/5.png', 'If you have questions about how to complete a task or what to do next, you can click the help icon in the upper-right corner.'],
    ['assets/help-slides/start/6.png', 'Your data will be used to further research of CRD and facial recognition. For more information about the research visit the About Us page.']
  ],
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
  'Shuffle': [
    ['assets/help-slides/shuffle/0.png', 'Click \'Reveal\' to show the faces and begin the timer.'],
    ['assets/help-slides/shuffle/1.png', 'You will have 10 seconds to memorize the placement of the faces.'],
    ['assets/help-slides/shuffle/2.png', 'After the timer is up, click cards to swap their positions. Click \'Done\' when you think the positions are correct.'],
    ['assets/help-slides/shuffle/3.png', 'For an incorrect solution, incorrect cards will be colored red. You will be deducted a small amount for each incorrect card.'],
    ['assets/help-slides/shuffle/4.png', 'You can toggle between your solution and the correct solution with the toggle at the bottom left corner.']
  ],
  'Forced Choice': [
    ['assets/help-slides/forced-choice/0.png', 'Click \'Reveal\' to show the face and begin the timer.'],
    ['assets/help-slides/forced-choice/1.png', 'You will have 3 seconds to memorize the face.'],
    ['assets/help-slides/forced-choice/2.png', 'After the timer is up select the face that you saw.'],
    ['assets/help-slides/forced-choice/3.png', 'You will be given feedback based on your selection.']
  ],
  'Same-Different': [
    ['assets/help-slides/same-different/0.png', 'Click \'Reveal\' to show the face and begin the timer.'],
    ['assets/help-slides/same-different/1.png', 'You will have 3 seconds to memorize the face.'],
    ['assets/help-slides/same-different/2.png', 'After the timer is up, decide whether the face is the same.'],
    ['assets/help-slides/same-different/3.png', 'You will be given feedback based on your selection.']
  ],
  'Training Tasks': [
    ['assets/help-slides/training/0.png', 'Welcome to the training tasks. You can revisit the learning task at any time with the bottom left-hand button, however often you need.'],
    ['assets/help-slides/training/1.png', 'When you complete a task, you can see your highest score and its passing status. You must get at least 6/8 to pass each task, and can do them any number of times.'],
    ['assets/help-slides/training/2.png', 'When you have passed each task, you will be able to move on to the assessment tasks with the bottom right-hand button. You will not be able to navigate back after moving on.']
  ],
  'Assessment Tasks': [
    ['assets/help-slides/assessment/0.png', 'You must complete these two assessment tasks each day, as they will be the primary way your progress is tracked. You cannot redo or restart them.']
  ],
  'Finish': [
    ['assets/help-slides/finish/0.png', 'You are done for the day, come back tomorrow for your next training. You can see your training history on the history page.']
  ]
}

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss'],
})

export class HelpModalComponent implements OnInit {

  constructor(private modalController: ModalController, private navParams: NavParams) { }

  ngOnInit() {
    this.task = this.navParams.data.paramTask;
    this.slides = slideValues[this.task];

    let images : any[] = [];
    for (let i = 0; i < this.slides.length; i++) {
      images.push(new Image());
      images[images.length - 1].src = this.slides[i][0];
    }

    this.outLeft = createAnimation()
    .addElement(document.querySelector('.swipe-card'))
    .fill('none')
    .duration(100)
    .keyframes([
      { offset: 0, transform: 'translateX(0%)' },
      { offset: 0.5, transform: 'translateX(-50%)' },
      { offset: 1, transform: 'translateX(-100%)' }
    ]);
    this.inRight = createAnimation()
    .addElement(document.querySelector('.swipe-card'))
    .fill('none')
    .duration(100)
    .keyframes([
      { offset: 0, transform: 'translateX(100%)' },
      { offset: 0.5, transform: 'translateX(50%)' },
      { offset: 1, transform: 'translateX(0%)' }
    ]);
    this.outRight = createAnimation()
    .addElement(document.querySelector('.swipe-card'))
    .fill('none')
    .duration(100)
    .keyframes([
      { offset: 0, transform: 'translateX(0%)' },
      { offset: 0.5, transform: 'translateX(50%)' },
      { offset: 1, transform: 'translateX(100%)' }
    ]);
    this.inLeft = createAnimation()
    .addElement(document.querySelector('.swipe-card'))
    .fill('none')
    .duration(100)
    .keyframes([
      { offset: 0, transform: 'translateX(-100%)' },
      { offset: 0.5, transform: 'translateX(-50%)' },
      { offset: 1, transform: 'translateX(0%)' }
    ]);
  }

  task : string;
  slides : string[][];
  currentSlide : number = 0;
  outLeft : any;
  inRight : any;
  outRight : any;
  inLeft : any;

  async closeModal() {
    await this.modalController.dismiss();
  }

  async onSwipeLeft(evt : any) {
    if (this.currentSlide < this.slides.length - 1) {
      await this.outLeft.play();
      this.currentSlide++;
      await this.inRight.play();
    } else {
      await this.outLeft.play();
      await this.inLeft.play();
    }
  }

  async onSwipeRight(evt : any) {
    if (this.currentSlide > 0) {
      await this.outRight.play();
      this.currentSlide--;
      await this.inLeft.play();
    } else {
      await this.outRight.play();
      await this.inRight.play();
    }
  }

}
