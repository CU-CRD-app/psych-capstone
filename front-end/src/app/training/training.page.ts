import { Component } from '@angular/core';
import { timer, interval } from 'rxjs';
import { AlertController, ModalController } from '@ionic/angular';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { takeUntil } from 'rxjs/operators';
import { createAnimation } from '@ionic/core';

const helpMessages = {
  start: ["Start", "Welcome to your daily training.\nPlease give yourself about 10 minutes to complete the tasks. Click to begin."],
  trainingTasks: ["Training Tasks", "Here is a list of the training tasks you still need to complete today.\nYou can do them in any order you like and however many times you like.\nYou must earn a score of at least 6/8 on each to progress to the assessment tasks."],
  assessmentTasks: ["Assessment Tasks", "Here are your assessment tasks for the day.\nThese will test how much you learned this session, and will be how your progress is tracked."],
  done: ["Finish", "You're done today. Come back tomorrow for your next training.\nYou can see your progress under the history page."],
  learning: ["Meet Today's Faces", "Memorize these faces and their names.\nYou will use them in the next tasks. You can revisit this module at any time."],
  nameAndFace: ["Name and Face", "Select the name that goes to the face.\nThe names are shuffled after each selection."],
  whosNew: ["Who's New?", "Select the face that you didn't see in the learning task."],
  memory: ["Memory Match", "Click reveal to show the cards, then memorize the placement of the face pairs in the given time. After the timer is up and the cards are turned back over, match the pairs together"],
  shuffle: ["Shuffle", "Click reveal to show the cards, then memorize the order in the given time, then put them back in order after they are shuffled."],
  forcedChoice: ["Forced Choice", "Memorize the face, then select which face you just saw."],
  sameDifferent: ["Same-Different", "Memorize the face, then decide whether the next face is the same."]
}

enum Stage { START, TRAINING, ASSESSMENT, DONE }
enum Task { LEARNING, NAME_FACE, WHOS_NEW, MEMORY, SHUFFLE, FORCED_CHOICE, SAME_DIFFERENT }

@Component({
  selector: 'app-training',
  templateUrl: 'training.page.html',
  styleUrls: ['training.page.scss']
})
export class TrainingPage {

  constructor(public alertController: AlertController, public modalController: ModalController) {

    this.trainingFacePaths = this.generateShuffledFaces(0); //getTrainingFaces()
    this.assessmentFacePaths = this.generateShuffledFaces(8); //getAssessmentFaces()
    this.setNames = this.generateRandomNames();

    // Preload images
    let images : any[] = [];
    for (let i = 0; i < this.trainingFacePaths.length; i++) {
      images.push(new Image());
      images[i].src = this.trainingFacePaths[i];
    }
    for (let i = 0; i < this.assessmentFacePaths.length; i++) {
      images.push(new Image());
      images[i].src = this.assessmentFacePaths[i];
    }
    images.push(new Image());
    images[images.length - 1].src = 'assets/background_imgs/mask1.png';

    // get today's progress from the database
    // get user level here
  }

  Stage = Stage;
  Task = Task;
  stage : Stage = Stage.START;
  task : Task = null;

  numFaces : number = 8; // hardcoded for now, happen to be 8 practice faces.
  namePool : string[] = ["Sam", "Kenny", "Jones", "Dave", "John", "Gale", "Kent", "Tom", "Bill", "Greg", "Anthony", "Tony", "George", "Kevin", "Dick", "Richard"];
  setNames : string[] = [];
  trainingFacePaths : string[] = [];
  assessmentFacePaths : string[] = [];
  progress : number = 0;
  level : number = 1;

  learningDone : boolean = false;
  scores : number[] = [8, 8, 8, 8, 8, 8];

  //Just icons
  assessment_icon : string = "assets/icon/assessment.svg";
  replay_icon : string = "assets/icon/replay.svg";
  face_icon : string = "assets/icon/face.svg";

  iterateStage() {
    this.task = null;
    if (!this.learningDone) {
      this.stage = Stage.START;
    } else if (this.scores[0] < 6 || this.scores[1] < 6 || this.scores[2] < 6 || this.scores[3] < 6) {
      this.stage = Stage.TRAINING;
    } else if (this.scores.includes(-1)) {
      this.stage = Stage.ASSESSMENT;
    } else {
      this.stage = Stage.DONE;
      this.progress = 0;
      timer(1200).subscribe(async () => {
        this.level++;

        let inflate = createAnimation()
        .addElement(document.querySelector('.level'))
        .fill('none')
        .duration(500)
        .keyframes([
          { offset: 0, transform: 'scale(1, 1)' },
          { offset: 0.5, transform: 'scale(2, 2)' },
          { offset: 1, transform: 'scale(1, 1)' }
        ]);
        await inflate.play();

        timer(500).subscribe(async () => {
          let fadeIn = createAnimation()
          .addElement(document.querySelector('.fade-in'))
          .fill('none')
          .duration(500)
          .fromTo('opacity', '0', '1');
          await fadeIn.play();
          Array.from(document.getElementsByClassName('fade-in') as HTMLCollectionOf<HTMLElement>)[0].style.opacity = '1';
        });

      });

      interval(100)
      .pipe(
        takeUntil(timer(1100))
      )
      .subscribe(() => {
        this.progress += .1;
      });
    }
  }

  getMessage(title : number) {
    if (title == 0 || title == 1) {
      switch (this.task) {
        case null:
          switch (this.stage) {
            case Stage.START:
              return helpMessages['start'][title];
            case Stage.TRAINING:
              return helpMessages['trainingTasks'][title];
            case Stage.ASSESSMENT:
              return helpMessages['assessmentTasks'][title];
            case Stage.DONE:
              return helpMessages['done'][title];
            default:
              return "Modules";
          }
        case Task.LEARNING:
          return helpMessages['learning'][title];
        case Task.NAME_FACE:
          return helpMessages['nameAndFace'][title];
        case Task.WHOS_NEW:
          return helpMessages['whosNew'][title];
        case Task.MEMORY:
          return helpMessages['memory'][title];
        case Task.SHUFFLE:
          return helpMessages['shuffle'][title];
        case Task.FORCED_CHOICE:
          return helpMessages['forcedChoice'][title];
        case Task.SAME_DIFFERENT:
          return helpMessages['sameDifferent'][title];
        default:
          return "Modules"
      }
    } else {
      return null;
    }
  }

  async getHelp() {
    const modal = await this.modalController.create({
      component: HelpModalComponent,
      componentProps: {
        "paramTask": this.getMessage(0),
      }
    });
    await modal.present();
  }

  //getTrainingFaces() {}
  //getAssessmentFaces() {}

  generateShuffledFaces(firstFace : number) {

    let faceNums : number[] = [];

    for (let i = firstFace; i < firstFace + this.numFaces; i++) {
      faceNums.push(i);
    }

    for (let i = faceNums.length-1; i > 0; i--) { // shuffle the numbers up
      let j = Math.floor(Math.random() * (i + 1));
      let tmp = faceNums[i];
      faceNums[i] = faceNums[j];
      faceNums[j] = tmp;
    }

    let facePaths : string[] = [];

    for (let num of faceNums) { // creates array of faces in random order to be passed to components
      facePaths.push("assets/sample-faces/" + num + ".png");
    }

    return facePaths
  }

  generateRandomNames() {
    let names : string[] = [];
    for (let i = 0; i < this.numFaces; i++) { // randomly shuffles names from namePool into an array passed to activities
      let name = Math.floor(Math.random() * this.namePool.length);
      while (names.indexOf(this.namePool[name]) > -1) { // Account for repeats
        name = Math.floor(Math.random() * this.namePool.length);
      }
      names.push(this.namePool[name]);
    }
    return names;
  }

  finished(score : number[], task : number) {
    this.scores[task] = Math.max(score[0], this.scores[task]);
    if (score[1] == 0) { // Retry
      this.task = null;
      timer(10).subscribe(() => { // Reload task in 10 ms
        switch (task) {
          case 0:
            this.task = Task.NAME_FACE;
            break;
          case 1:
            this.task = Task.WHOS_NEW;
            break;
          case 2:
            this.task = Task.MEMORY;
            break;
          case 3:
            this.task = Task.SHUFFLE;
            break;
          case 4:
            this.task = Task.FORCED_CHOICE;
            break;
          case 5:
            this.task = Task.SAME_DIFFERENT;
            break;
        }
      });
    } else if (score[1] == 1) { // Learning
      this.task = Task.LEARNING;
    } else { // Done
      this.task = null;
    }
    if (task > 3) {
      this.iterateStage();
    }
    // save today's progress to database
  }

  async taskExitAlert() {
    const alert = await this.alertController.create({
      header: 'Quit',
      message: 'Do you want to quit? Your progress on this task will be lost.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Quit',
          handler: () => {
            this.task = null;
          }
        }
      ]
    });

    await alert.present();
  }
}