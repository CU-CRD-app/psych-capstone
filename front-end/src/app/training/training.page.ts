import { Component } from '@angular/core';
import { timer, interval } from 'rxjs';
import { AlertController, ModalController, IonRouterOutlet } from '@ionic/angular';
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

const namePool = {
  1: ['James', 'John', 'Robert', 'Michael', 'Will', 'David', 'Richard', 'Joseph'],
  2: ['Thomas', 'Charlie', 'Chris', 'Daniel', 'Matthew', 'Anthony', 'Don', 'Mark'],
  3: ['Paul', 'Steven', 'Andrew', 'Ken', 'Joshua', 'George', 'Kevin', 'Brian'],
  4: ['Edward', 'Ron', 'Tim', 'Jason', 'Jeff', 'Ryan', 'Jacob', 'Gary'],
  5: ['Nick', 'Eric', 'Stephen', 'Jonathan', 'Larry', 'Justin', 'Scott', 'Brandon'],
  6: ['Frank', 'Ben', 'Greg', 'Sam', 'Ray', 'Patrick', 'Alex', 'Jack'],
  7: ['Dennis', 'Jerry', 'Tyler', 'Aaron', 'Jose', 'Henry', 'Doug', 'Adam'],
  8: ['Peter', 'Nathan', 'Zach', 'Walter', 'Kyle', 'Harry', 'Carl', 'Jeremy']
}

enum Stage { START, TRAINING, ASSESSMENT, DONE }
enum Task { LEARNING, NAME_FACE, WHOS_NEW, MEMORY, SHUFFLE, FORCED_CHOICE, SAME_DIFFERENT }

@Component({
  selector: 'app-training',
  templateUrl: 'training.page.html',
  styleUrls: ['training.page.scss']
})
export class TrainingPage {

  constructor(public alertController: AlertController, public modalController: ModalController, private routerOutlet: IonRouterOutlet) {

    // get today's progress and user level
    this.userLevel = 1;
    this.stage = Stage.START;
    this.learningDone = false;
    this.scores = [-1, -1, -1, -1, -1, -1];
    this.task = null;

    this.setNames = namePool[this.userLevel];
    this.trainingFacePaths = this.getTrainingFaces();
    this.whosNewFacePaths = this.getWhosNewFaces();
    this.assessmentFacePaths = this.getAssessmentFaces(true);
    this.preAssessmentFacePaths = this.getAssessmentFaces(false);
    this.postAssessmentFacePaths = this.getAssessmentFaces(false);

    this.routerOutlet.swipeGesture = false;

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
  }

  ngAfterViewInit() {
    this.renderHelp();
  }

  Stage = Stage;
  Task = Task;
  stage : Stage;
  task : Task;

  numFaces : number = 8;
  assessmentPoolSize : number = 29; // should be thirty, we got one messed up face in the pre/post assessment pool
  assessment_icon : string = "assets/icon/assessment.svg";
  replay_icon : string = "assets/icon/replay.svg";
  face_icon : string = "assets/icon/face.svg";

  setNames : string[];
  trainingFacePaths : string[];
  whosNewFacePaths : string[];
  assessmentFacePaths : string[];
  preAssessmentFacePaths : string[];
  postAssessmentFacePaths : string[];
  progress : number;
  userLevel : number;
  learningDone : boolean;
  scores : number[];

  iterateStage() {
    let currentStage = this.stage;
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
        this.userLevel++;

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

    if (this.stage != currentStage && this.stage != Stage.DONE) {
      this.renderHelp();
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

  async getHelp(displayFirst : boolean) {
    const modal = await this.modalController.create({
      component: HelpModalComponent,
      componentProps: {
        "paramTask": this.getMessage(0),
        "displayFirst": displayFirst
      }
    });
    await modal.present();
  }

  renderHelp() {
    if (this.userLevel == 1) {
      timer(500).subscribe(() => {
        this.getHelp(true);
      });
    }
  }

  getTrainingFaces() {
    let facePaths : string[] = [];
    for (let i = 0; i < this.numFaces; i++) {
      facePaths.push("assets/sample-faces/training/level-" + this.userLevel + "/" + i + ".png");
    }
    return facePaths;
  }
  
  getAssessmentFaces(daily : boolean) {
    let facePaths : string[] = [];
    let faceNums : number[] = [];

    for (let i = 0; i < this.numFaces; i++) {
      let face = Math.floor(Math.random() * this.assessmentPoolSize);
      while (faceNums.indexOf(face) > -1) { // Account for repeats
        face = Math.floor(Math.random() * this.assessmentPoolSize);
      }
      faceNums.push(face);
    }
    for (let face of faceNums) {
      if (daily) {
        facePaths.push("assets/sample-faces/daily-assessment/" + face + ".jpg");
      } else {
        facePaths.push("assets/sample-faces/pre-post-assessment/" + face + ".jpg");
      }
    }
    return facePaths;
  }

  getWhosNewFaces() {
    let facePaths : string[] = [];
    let afterFaces = this.numFaces - this.userLevel + (1 - Math.round(this.userLevel/this.numFaces));
    let beforeFaces = this.numFaces - afterFaces;
    for (let i = 0; i < afterFaces; i++) {
      facePaths.push("assets/sample-faces/training/level-" + (this.userLevel + 1) + "/" + i + ".png");
    }
    for (let i = 0; i < beforeFaces; i++) {
      facePaths.push("assets/sample-faces/training/level-" + (this.userLevel - 1) + "/" + i + ".png");
    }
    return facePaths;
  }

  finished(score : number[], task : number) {
    this.scores[task] = Math.max(score[0], this.scores[task]);
    if (score[1] != 0) { // Not retrying
      if (score[1] == 1) { // Learning
        this.task = Task.LEARNING;
      } else { // Done
        this.task = null;
      }
      if (task == 4 || task == 5) { // Assessments automatically move on
        this.iterateStage();
      }
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
            timer(500).subscribe(() => {
              this.task = null;
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async startAssessmentAlert() {
    const alert = await this.alertController.create({
      header: 'Assessment',
      message: 'Do you want to move on to the assessment? You will not be able to come back to training today.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Go',
          handler: () => {
            timer(500).subscribe(() => {
              this.iterateStage();
            })
          }
        }
      ]
    });

    await alert.present();
  }
}