import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

const helpMessages = {
  start: ["Start", "Welcome to your daily training.\nPlease give yourself about 10 minutes to complete the tasks. You won't be able to access other parts of the app until you have finished. Click to start the learning task."],
  trainingTasks: ["Training Tasks", "Here is a list of the training tasks you still need to complete today.\nYou can do them in any order you like.\nWhen you're done with these, you will have two assessment tasks to complete."],
  assessmentTasks: ["Assessment Tasks", "Here are your assessment tasks for the day.\nThese will test how much you learned this session, and will be how your progress is tracked."],
  done: ["Finish", "You're done today. Come back tomorrow for your next training.\nYou can see your progress under the history tab."],
  learning: ["Meet Today's Faces", "Memorize these faces and their names.\nYou will use them in the next tasks."],
  nameAndFace: ["Name and Face", "Select the name that goes to the face.\nThe names are shuffled after each selection."],
  whosNew: ["Who's New?", "Select the face that wasn't part of the original set."],
  memory: ["Memory Match", "Memorize the placement of the face pairs, then match them when they are turned over."],
  shuffle: ["Shuffle", "Put the cards in the same order that you saw them originally."],
  forcedChoice: ["Forced Choice", "You will be shown one face to memorize, and then a set of faces.\nYou will be asked to choose which face in the set matches the original"],
  sameDifferent: ["Same-Different", "You will be shown one face and then another, and you will decide whether they are the same."]
}

enum Stage { START, TRAINING, ASSESSMENT, DONE }
enum Task { LEARNING, NAME_FACE, WHOS_NEW, MEMORY, SHUFFLE, FORCED_CHOICE, SAME_DIFFERENT }

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public alertController: AlertController) {
    for (let i = 0; i < this.numFaces; i++) //randomly shuffles names from namePool into an array passed to activities
    {
      let name = Math.floor(Math.random() * this.namePool.length);
      this.setNames.push(this.namePool[name]);
      this.namePool = this.namePool.slice(0, name).concat(this.namePool.slice(name + 1, this.namePool.length));
      this.faceNums.push(i);
    }

    for (let i = this.faceNums.length-1; i > 0; i--) //shuffle the numbers up
    {
      let j = Math.floor(Math.random() * (i + 1)); //some index to the left of i
      let tmp = this.faceNums[i]; //current num stored in tmp
      this.faceNums[i] = this.faceNums[j]; //swap current slot with randomly chosen slot
      this.faceNums[j] = tmp; //set the chosen slot to tmp
    }
    for (let num of this.faceNums) //creates array of faces in random order to be passed to components
    {
      this.facePaths.push(`./../../assets/sample-faces/${num}.png`);
    }

    // Pull user record, if they have completed today's tasks then stage = done
    let userIsDone = false; // http request to database
    if (userIsDone) { // This may change if we allow users to break in the middle of training
      this.stage = Stage.DONE;
    }

  }

  Stage = Stage;
  Task = Task;
  stage : Stage = Stage.START;
  task : Task = null;

  numFaces : number = 8; // hardcoded for now, happen to be 8 practice faces.

  namePool : string[] = ["Sam", "Kenny", "Jones", "Dave", "John", "Gale", "Kent", "Tom", "Bill", "Greg", "Anthony", "Tony", "George", "Kevin", "Dick", "Richard"];
  setNames : string[] = []

  faceNums : number[] = []
  facePaths : string[] = []

  learningDone : boolean = false;
  scores : number[] = [-1, -1, -1, -1, -1, -1];

  iterateStage() {
    this.task = null;
    if (!this.learningDone) {
      this.stage = Stage.START;
    } else if (this.scores[0] == -1 || this.scores[1] == -1 || this.scores[2] == -1 || this.scores[3] == -1) {
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
}