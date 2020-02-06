import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

const helpMessages = {
  start: ["Modules", "Welcome to your daily training."],
  trainingTasks: ["Training Tasks", "Default Message"],
  assessmentTasks: ["Assessment Tasks", "Default Message"],
  done: ["Finished", "Default Message"],
  learning: ["Meet Today's Faces", "Default Message"],
  nameAndFace: ["Name and Face", "Default Message"],
  whosNew: ["Who's New?", "Default Message"],
  memory: ["Memory Match", "Default Message"],
  shuffle: ["Shuffle", "Default Message"],
  forcedChoice: ["Forced Choice", "Default Message"],
  sameDifferent: ["Same-Different", "Default Message"]
}

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
  }

  numFaces : number = 8; //hardcoded for now, happen to be 8 practice faces.
  progress : number = 0;

  namePool : string[] = ["Sam", "Kenny", "Jones", "Dave", "John", "Gale", "Kent", "Tom", "Bill", "Greg", "Anthony", "Tony", "George", "Kevin", "Dick", "Richard"];
  setNames : string[] = []

  faceNums : number[] = []
  facePaths : string[] = []

  learningDone : boolean = false;
  scores : number[] = [-1, -1, -1, -1, -1, -1];

  getMenuStage() {
    if (!this.learningDone) {
      return 0;
    } else if (this.scores[0]==-1 || this.scores[1]==-1 || this.scores[2]==-1 || this.scores[3]==-1) {
      return 1;
    } else if (this.scores.includes(-1)) {
      return 2;
    } else {
      return 3;
    }
  }

  getMessage(title : number) {
    if (title == 0 || title == 1) {
      switch (this.progress) {
        case 0:
          switch (this.getMenuStage()) {
            case 0:
              return helpMessages['start'][title];
            case 1:
              return helpMessages['trainingTasks'][title];
            case 2:
              return helpMessages['assessmentTasks'][title];
            case 3:
              return helpMessages['done'][title];
            default:
              return "Modules";
          }
        case 1:
          return helpMessages['learning'][title];
        case 2:
          return helpMessages['nameAndFace'][title];
        case 3:
          return helpMessages['whosNew'][title];
        case 4:
          return helpMessages['memory'][title];
        case 5:
          return helpMessages['shuffle'][title];
        case 6:
          return helpMessages['forcedChoice'][title];
        case 7:
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
