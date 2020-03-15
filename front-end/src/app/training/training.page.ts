import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

const helpMessages = {
  start: ["Start", "Welcome to your daily training.\nPlease give yourself about 10 minutes to complete the tasks. Click to start the learning task."],
  trainingTasks: ["Training Tasks", "Here is a list of the training tasks you still need to complete today.\nYou can do them in any order you like.\nYou must earn a score of at least 6/8 on each to progress to the assessment tasks."],
  assessmentTasks: ["Assessment Tasks", "Here are your assessment tasks for the day.\nThese will test how much you learned this session, and will be how your progress is tracked."],
  done: ["Finish", "You're done today. Come back tomorrow for your next training.\nYou can see your progress under the history page."],
  learning: ["Meet Today's Faces", "Memorize these faces and their names.\nYou will use them in the next tasks."],
  nameAndFace: ["Name and Face", "Select the name that goes to the face.\nThe names are shuffled after each selection."],
  whosNew: ["Who's New?", "Select the face that wasn't part of the original set."],
  memory: ["Memory Match", "Memorize the placement of the face pairs in the given time, then match them after they are turned over."],
  shuffle: ["Shuffle", "Memorize the order of the cards in the given time, then put them back in order after they are shuffled."],
  forcedChoice: ["Forced Choice", "You will be shown one face to memorize, and then a set of faces.\nYou will be asked to choose which face in the set matches the original"],
  sameDifferent: ["Same-Different", "You will be shown one face and then another, and you will decide whether they are the same."]
}

enum Stage { START, TRAINING, ASSESSMENT, DONE }
enum Task { LEARNING, NAME_FACE, WHOS_NEW, MEMORY, SHUFFLE, FORCED_CHOICE, SAME_DIFFERENT }

@Component({
  selector: 'app-training',
  templateUrl: 'training.page.html',
  styleUrls: ['training.page.scss']
})
export class TrainingPage {

  constructor(public alertController: AlertController) {

    this.trainingFacePaths = this.generateShuffledFaces(0);
    this.assessmentFacePaths = this.generateShuffledFaces(8);
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

  learningDone : boolean = false;
  scores : number[] = [-1, -1, -1, -1, -1, -1];

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
    const alert = await this.alertController.create({
      header: this.getMessage(0),
      message: this.getMessage(1),
      buttons: ['OK']
    });

    await alert.present();
  }

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

  finished(score : number, task : number) {
    this.scores[task] = Math.max(score, this.scores[task]);
    this.task = null;
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