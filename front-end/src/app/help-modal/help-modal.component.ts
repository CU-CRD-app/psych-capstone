import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController, NavParams, IonSlides } from '@ionic/angular';

const slideValues = {
  'Start': [
    ['assets/help-slides/start/0.png', 'Welcome to your CRD training. Please take a minute to review these slides and familiarize yourself with the training process.'],
    ['assets/help-slides/start/1.png', 'There are 8 levels to complete. You should complete one level per day, in about 10-15 minutes.'],
    ['assets/help-slides/start/2.png', 'In the learning task you will learn the day\'s names and faces, then you will use those faces to complete the challenges in the four training tasks.'],
    ['assets/help-slides/start/3.png', 'After passing the training tasks, you will complete two assessment tasks. Your level will increase after you finish.'],
    ['assets/help-slides/start/4.png', 'Before Level 1 and after Level 8 you will complete an additional assessment to estimate your overall progress.'],
    ['assets/help-slides/start/5.png', 'If you have questions about how to complete a task or what to do next, you can click the help icon in the upper-right corner.'],
    ['assets/help-slides/start/6.png', 'Your data will be used to further research of CRD and facial recognition. For more information about the research visit the About Us page.'],
    ['assets/help-slides/start/7.png', 'Should you need to review this information again, simply click the help icon in the upper right-hand corner of any help page.']
  ],
  'Overview': [
    ['assets/help-slides/start/0.png', 'These slides will provide an overview of the training process.'],
    ['assets/help-slides/start/1.png', 'There are 8 levels to complete. You should complete one level per day, in about 10-15 minutes.'],
    ['assets/help-slides/start/2.png', 'In the learning task you will learn the day\'s names and faces, then you will use those faces to complete the challenges in the four training tasks.'],
    ['assets/help-slides/start/3.png', 'After passing the training tasks, you will complete two assessment tasks. Your level will increase after you finish.'],
    ['assets/help-slides/start/4.png', 'Before Level 1 and after Level 8 you will complete an additional assessment to estimate your overall progress.'],
    ['assets/help-slides/start/5.png', 'If you have questions about how to complete a task or what to do next, you can click the help icon in the upper-right corner.'],
    ['assets/help-slides/start/6.png', 'Your data will be used to further research of CRD and facial recognition. For more information about the research visit the About Us page.']
  ],
  'Meet Today\'s Faces': [
    ['assets/help-slides/learning/0.png', 'Memorize the eight name-face pairs you are shown; they will be the basis of your daily training.'],
    ['assets/help-slides/learning/1.png', 'You can come back to this module at any time after finishing.']
  ],
  'Name and Face': [
    ['assets/help-slides/name-face/0.png', 'For each of the names you\'ve seen before, you\'ll be asked to match the appropriate face.'],
    ['assets/help-slides/name-face/1.png', 'You\'ll get a point for each face you match correctly.'],
    ['assets/help-slides/name-face/2.png', 'Whenever you guess incorrectly, you\'ll be shown the correct answer as well as the two names.']
  ],
  'Who\'s New?': [
    ['assets/help-slides/whos-new/0.png', 'Select the face that you haven\'t yet seen today, and that wasn\'t part of the learning task.'],
    ['assets/help-slides/whos-new/1.png', 'You\'ll get a point for each face you guess correctly.'],
    ['assets/help-slides/whos-new/2.png', 'Whenever you guess incorrectly, you\'ll be shown the correct answer.']
  ],
  'Memory Match': [
    ['assets/help-slides/memory-match/0.png', 'Click anywhere to show the faces and begin the timer.'],
    ['assets/help-slides/memory-match/1.png', 'You will have 10 seconds to memorize the placement of as many face pairs as you can.'],
    ['assets/help-slides/memory-match/2.png', 'After the timer is up, click the cards to match the pairs. When you correctly match a pair, they will be revealed.'],
    ['assets/help-slides/memory-match/3.png', 'Correct matches award 4 points, while incorrect matches deduct 1 point.']
  ],
  'Shuffle': [
    ['assets/help-slides/shuffle/0.png', 'Click anywhere to show the faces and begin the timer.'],
    ['assets/help-slides/shuffle/1.png', 'You will have 10 seconds to memorize the placement of the faces.'],
    ['assets/help-slides/shuffle/2.png', 'After the timer is up, click cards to swap their positions. Click \'Done\' when you think the positions are correct.'],
    ['assets/help-slides/shuffle/3.png', 'For an incorrect solution, incorrect cards will be colored red. You will be awarded a point for each correct card.'],
    ['assets/help-slides/shuffle/4.png', 'You can toggle between your solution and the correct solution with the toggle at the bottom.']
  ],
  'Forced Choice': [
    ['assets/help-slides/forced-choice/0.png', 'Click anywhere to show the face and begin the timer.'],
    ['assets/help-slides/forced-choice/1.png', 'You will have 3 seconds to memorize the face.'],
    ['assets/help-slides/forced-choice/2.png', 'After the timer is up select the face that you saw.'],
    ['assets/help-slides/forced-choice/3.png', 'You will receive a point for each correct answer.']
  ],
  'Same-Different': [
    ['assets/help-slides/same-different/0.png', 'Click anywhere to show the face and begin the timer.'],
    ['assets/help-slides/same-different/1.png', 'You will have 3 seconds to memorize the face.'],
    ['assets/help-slides/same-different/2.png', 'After the timer is up, decide whether the face is the same.'],
    ['assets/help-slides/same-different/3.png', 'You will receive a point for each correct answer.']
  ],
  'Training Tasks': [
    ['assets/help-slides/training/0.png', 'Welcome to the training tasks. You can revisit the learning task however often you need with the bottom left-hand button.'],
    ['assets/help-slides/training/1.png', 'When you complete a task, you can see your highest score. You must get at least 75% to pass each task, and can do them any number of times.'],
    ['assets/help-slides/training/2.png', 'After passing every task, you can progress to the daily assessment tasks with the bottom right-hand button. You will not be able to come back today after moving on.']
  ],
  'Assessment Tasks': [
    ['assets/help-slides/assessment/0.png', 'The daily assessment tasks track your learning progress. You cannot redo or restart them.']
  ],
  'Finish': [
    ['assets/help-slides/finish/0.png', 'You are done for the day, come back tomorrow for your next training. You can see your training history on the history page.']
  ],
  'Pre-Assessment': [
    ['assets/help-slides/pre-post/0.png', 'Welcome to your pre-assessment. This is a one-time test; it will provide a baseline for your current CRD.'],
    ['assets/help-slides/same-different/0.png', 'Click anywhere to show the face and begin the timer.'],
    ['assets/help-slides/same-different/1.png', 'You will have 3 seconds to memorize the face.'],
    ['assets/help-slides/same-different/2.png', 'After the timer is up, decide whether the face is the same.'],
    ['assets/help-slides/pre-post/1.png', 'This test consists of 30 questions, so set aside a few minutes to complete it.'],
    ['assets/help-slides/finish/0.png', 'When you have finished you can officially begin your training in Level 1.']
  ],
  'Post-Assessment': [
    ['assets/help-slides/pre-post/0.png', 'Welcome to your post-assessment. This is your final test; after this, your participation in this research will be complete.'],
    ['assets/help-slides/pre-post/1.png', 'This test consists of 30 questions, so set aside a few minutes to complete it.']
  ]
}

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss'],
})

export class HelpModalComponent implements OnInit {
  @Input() firstDisplayed : boolean;
  @ViewChild('slideElement', {static: false}) slideElement: IonSlides;

  constructor(private modalController: ModalController, private navParams: NavParams) { }

  ngOnInit() {

    this.task = this.navParams.data.paramTask;
    this.displayFirst = this.navParams.data.displayFirst;
    this.slides = slideValues[this.task];
    this.currentSlide = 0;
    this.showOverview = false;

    let images : any[] = [];
    for (let i = 0; i < this.slides.length; i++) {
      images.push(new Image());
      images[images.length - 1].src = this.slides[i][0];
    }

    this.hideQuit = false;
    if (this.displayFirst && this.slides.length > 1) {
      this.hideQuit = true;
    }
  }

  task : string;
  slides : string[][];
  currentSlide : number;
  showOverview : boolean;
  displayFirst : boolean;
  hideQuit : boolean;

  async closeModal() {
    await this.modalController.dismiss();
  }

  async changeSlide() {
    this.currentSlide = await this.slideElement.getActiveIndex();
    if (this.currentSlide == this.slides.length - 1) {
      this.hideQuit = false;
    }
  }

  toggleOverview() {
    this.slideElement.slideTo(0);
    if (this.showOverview) {
      this.showOverview = false;
      this.ngOnInit();
    } else {
      this.showOverview = true;
      this.task = 'Overview';
      this.slides = slideValues[this.task];

      let images : any[] = [];
      for (let i = 0; i < this.slides.length; i++) {
        images.push(new Image());
        images[images.length - 1].src = this.slides[i][0];
      }
    }
  }

}
