import { Component } from '@angular/core';
import { timer, interval } from 'rxjs';
import { AlertController, ModalController, IonRouterOutlet, ToastController } from '@ionic/angular';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { takeUntil, map } from 'rxjs/operators';
import { createAnimation } from '@ionic/core';
import { GetProgressService } from '../service/get-progress.service';
import { SubmitScoresService } from '../service/submit-scores.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RaceSelectModalComponent } from '../race-select-modal/race-select-modal.component';
import { ModalsPluginWeb } from '@capacitor/core';

enum Race { BLACK, ASIAN, LATINO, WHITE }
enum Stage { START, TRAINING, ASSESSMENT, DONE }
enum Task { NAME_FACE, WHOS_NEW, MEMORY, SHUFFLE, FORCED_CHOICE, SAME_DIFFERENT, PRETEST, POSTTEST, LEARNING }

// let raceProperties = {
//   0: {
//     race: Race.BLACK,
//     //Change to initials.
//     namePool: {
//       1: ['J.S', 'O.N', 'R.T', 'M.A', 'W.L', 'D.D', 'R.C', 'J.I'],
//       2: ['T.S', 'C.H', 'C.S', 'D.A', 'M.W', 'A.Y', 'D.J', 'M.K'],
//       3: ['P.L', 'S.T', 'A.D', 'K.D', 'J.K', 'G.W', 'K.E', 'B.C'],
//       4: ['E.D', 'R.N', 'T.M', 'J.H', 'K.H', 'R.B', 'J.Y', 'G.C'],
//       5: ['N.C', 'E.B', 'S.V', 'J.F', 'L.T', 'J.B', 'S.B', 'B.H'],
//       6: ['F.Y', 'B.S', 'G.P', 'S.R', 'R.H', 'P.J', 'A.W', 'J.C'],
//       7: ['D.Q', 'J.N', 'T.W', 'A.G', 'J.M', 'H.K', 'D.L', 'A.P'],
//       8: ['P.P', 'N.S', 'Z.S', 'W.W', 'K.F', 'H.I', 'C.B', 'J.L']
//     }
//   },
//   1: {
//     race: Race.ASIAN,
//     //Change to initials.
//     namePool: {
//       1: ['J.S', 'O.N', 'R.T', 'M.A', 'W.L', 'D.D', 'R.C', 'J.I'],
//       2: ['T.S', 'C.H', 'C.S', 'D.A', 'M.W', 'A.Y', 'D.J', 'M.K'],
//       3: ['P.L', 'S.T', 'A.D', 'K.D', 'J.K', 'G.W', 'K.E', 'B.C'],
//       4: ['E.D', 'R.N', 'T.M', 'J.H', 'K.H', 'R.B', 'J.Y', 'G.C'],
//       5: ['N.C', 'E.B', 'S.V', 'J.F', 'L.T', 'J.B', 'S.B', 'B.H'],
//       6: ['F.Y', 'B.S', 'G.P', 'S.R', 'R.H', 'P.J', 'A.W', 'J.C'],
//       7: ['D.Q', 'J.N', 'T.W', 'A.G', 'J.M', 'H.K', 'D.L', 'A.P'],
//       8: ['P.P', 'N.S', 'Z.S', 'W.W', 'K.F', 'H.I', 'C.B', 'J.L']
//     }
//   },
//   2: {
//     race: Race.LATINO,
//     //Change to initials.
//     namePool: {
//       1: ['J.S', 'O.N', 'R.T', 'M.A', 'W.L', 'D.D', 'R.C', 'J.I'],
//       2: ['T.S', 'C.H', 'C.S', 'D.A', 'M.W', 'A.Y', 'D.J', 'M.K'],
//       3: ['P.L', 'S.T', 'A.D', 'K.D', 'J.K', 'G.W', 'K.E', 'B.C'],
//       4: ['E.D', 'R.N', 'T.M', 'J.H', 'K.H', 'R.B', 'J.Y', 'G.C'],
//       5: ['N.C', 'E.B', 'S.V', 'J.F', 'L.T', 'J.B', 'S.B', 'B.H'],
//       6: ['F.Y', 'B.S', 'G.P', 'S.R', 'R.H', 'P.J', 'A.W', 'J.C'],
//       7: ['D.Q', 'J.N', 'T.W', 'A.G', 'J.M', 'H.K', 'D.L', 'A.P'],
//       8: ['P.P', 'N.S', 'Z.S', 'W.W', 'K.F', 'H.I', 'C.B', 'J.L']
//     }
//   },
//   3: {
//     race: Race.WHITE,
//     //Change to initials.
//     namePool: {
//       1: ['J.S', 'O.N', 'R.T', 'M.A', 'W.L', 'D.D', 'R.C', 'J.I'],
//       2: ['T.S', 'C.H', 'C.S', 'D.A', 'M.W', 'A.Y', 'D.J', 'M.K'],
//       3: ['P.L', 'S.T', 'A.D', 'K.D', 'J.K', 'G.W', 'K.E', 'B.C'],
//       4: ['E.D', 'R.N', 'T.M', 'J.H', 'K.H', 'R.B', 'J.Y', 'G.C'],
//       5: ['N.C', 'E.B', 'S.V', 'J.F', 'L.T', 'J.B', 'S.B', 'B.H'],
//       6: ['F.Y', 'B.S', 'G.P', 'S.R', 'R.H', 'P.J', 'A.W', 'J.C'],
//       7: ['D.Q', 'J.N', 'T.W', 'A.G', 'J.M', 'H.K', 'D.L', 'A.P'],
//       8: ['P.P', 'N.S', 'Z.S', 'W.W', 'K.F', 'H.I', 'C.B', 'J.L']
//     }
//   }
// }
let namePool = {
  1: ['J.S', 'O.N', 'R.T', 'M.A', 'W.L', 'D.D', 'R.C', 'J.I'],
  2: ['T.S', 'C.H', 'C.S', 'D.A', 'M.W', 'A.Y', 'D.J', 'M.K'],
  3: ['P.L', 'S.T', 'A.D', 'K.D', 'J.K', 'G.W', 'K.E', 'B.C'],
  4: ['E.D', 'R.N', 'T.M', 'J.H', 'K.H', 'R.B', 'J.Y', 'G.C'],
  5: ['N.C', 'E.B', 'S.V', 'J.F', 'L.T', 'J.B', 'S.B', 'B.H'],
  6: ['F.Y', 'B.S', 'G.P', 'S.R', 'R.H', 'P.J', 'A.W', 'J.C'],
  7: ['D.Q', 'J.N', 'T.W', 'A.G', 'J.M', 'H.K', 'D.L', 'A.P'],
  8: ['P.P', 'N.S', 'Z.S', 'W.W', 'K.F', 'H.I', 'C.B', 'J.L']
}


@Component({
  selector: 'app-training',
  templateUrl: 'training.page.html',
  styleUrls: ['training.page.scss']
})
export class TrainingPage {

  constructor(public alertController: AlertController, public modalController: ModalController, private routerOutlet: IonRouterOutlet, public getProgress: GetProgressService, public submitScores: SubmitScoresService, public toastController : ToastController, public localNotifications : LocalNotifications, public http : HttpClient) {

    this.routerOutlet.swipeGesture = false;

  }

  ionViewWillEnter() {
    this.stage = null;
    this.task = null;
    timer(500).subscribe(() => {
      // replace with user choice
      this.currentRace = Race.BLACK;
      this.initCurrentLevel();
    });
  }

  ionViewWillLeave() {
    Array.from(document.getElementsByClassName('fade-in') as HTMLCollectionOf<HTMLElement>)[0].style.opacity = '0';
  }

  ngAfterViewInit() {
    if (this.userLevel == 0) {
      timer(500).subscribe(() => {
        this.getHelp(true);
      });
    }
  }

  Race = Race;
  Stage = Stage;
  Task = Task;
  stage : Stage = null;
  task : Task = null;
  learningDone : boolean = false;
  scores : number[] = [-1, -1, -1, -1, -1, -1];

  minTrainScore : number = 0.75;
  taskLengths : number[] = [8, 8, 32, 16, 8, 8];
  numFaces : number = 8;
  assessmentPoolSize : number = 30;
  assessment_icon : string = "assets/icon/assessment.svg";
  replay_icon : string = "assets/icon/replay.svg";
  face_icon : string = "assets/icon/face.svg";

  setNames : string[];
  trainingFacePaths : string[];
  whosNewFacePaths : string[];
  assessmentFacePaths : string[];
  progress : number;
  currentRace : any;
  userLevel : any;
  /**
   * trial starts
   * userRace : any;
   * trial ends
  */
  
  initCurrentLevel(race : Race = Race.BLACK) {
    // console.log("raceName just before sumbit score:");
    // console.log(raceName);
    //this.showRaceSelect();
    /**
    * Option = User's choice
    * Option -> Database
    * let days = res['days'];
    * race = days[day]['race'];this.currentRace = race;
    */
    // this.currentRace = race;

    this.getProgress.getData().subscribe((res) => {
      // console.log(res);
      let days = res['days'];
      this.userLevel = res['level'];
      // this.currentRace = res['race'];
      /**
       * trial starts
       * this.userRace = res['race'];
       * this.userRace = 
       * trial ends
      */ 

      let levelCompletedToday = false;

      if (this.userLevel == 0 || this.userLevel == 9) {

        this.getPrePostAssessmentFaces().then((faces) => {
          this.assessmentFacePaths = faces;
          timer(1000).subscribe(() => {
            this.stage = Stage.START;
          });
        });

      } else if (this.userLevel > 0 && this.userLevel < 9) {

        let today = new Date().toLocaleDateString();
        let lastDay = '';
        for (let day in days) {
          if ([days[day]['nameface'], days[day]['whosnew'], days[day]['memory'], days[day]['shuffle'], days[day]['forcedchoice'], days[day]['samedifferent']].indexOf(-1) < 0) {
            lastDay = new Date(days[day]['date']).toLocaleDateString();
          }
        }
        if (today == lastDay) {
          levelCompletedToday = true;
        }

        if (!levelCompletedToday) {
          this.setNames = namePool[this.userLevel]; //raceProperties[this.currentRace].namePool[this.userLevel];
          this.getTrainingFaces().then((faces) => {
            this.trainingFacePaths = faces;
            this.getWhosNewFaces().then((faces) => {
              this.whosNewFacePaths = faces;
              this.getDailyAssessmentFaces().then((faces) => {
                this.assessmentFacePaths = faces;
                if (days[this.userLevel - 1]) {
                  this.scores = [days[this.userLevel - 1]['nameface'], days[this.userLevel - 1]['whosnew'], days[this.userLevel - 1]['memory'], days[this.userLevel - 1]['shuffle'], days[this.userLevel - 1]['forcedchoice'], days[this.userLevel - 1]['samedifferent']];
                  this.learningDone = this.scores.indexOf(-1) > -1;
                }
                timer(1000).subscribe(() => {
                  this.iterateStage();
                })
              });
            });
          });

        } else {
          this.userLevel--;
          this.finishLevel();
        }

      } else {
        this.stage = Stage.DONE;
      }

      let images : any[] = [];
      images.push(new Image());
      images[images.length - 1].src = 'assets/background_imgs/mask1.png';

    }, async (err) => { 
      const toast = await this.toastController.create({
        message: 'Something went wrong. Please try logging out and back in',
        color: 'danger',
        duration: 2000
      });
      toast.present();
    });

  }

  iterateStage() {
    this.task = null;
    if (!this.learningDone) {
      this.stage = Stage.START;
    } else if (this.trainingNotDone()) {
      this.stage = Stage.TRAINING;
      if (this.scores[Task.NAME_FACE] == -1 && this.scores[Task.WHOS_NEW] == -1 && this.scores[Task.MEMORY] == -1 && this.scores[Task.SAME_DIFFERENT] == -1) {
        this.renderLevelOneHelp();
      }
    } else if (this.scores.includes(-1)) {
      this.stage = Stage.ASSESSMENT;
      if (this.scores[Task.FORCED_CHOICE] == -1 && this.scores[Task.SAME_DIFFERENT] == -1) {
        this.renderLevelOneHelp();
      }
    } else {
      this.finishLevel();
      this.scheduleNotification();
    }
  }

  getTitle() {
    switch (this.task) {
      case null:
        switch (this.stage) {
          case Stage.START:
            return 'Start';
          case Stage.TRAINING:
            return 'Training Tasks';
          case Stage.ASSESSMENT:
            return 'Assessment Tasks';
          case Stage.DONE:
            return 'Finish';
          default:
            return "Modules";
        }
      case Task.LEARNING:
        return 'Meet Today\'s Faces';
      case Task.NAME_FACE:
        return 'Name and Face';
      case Task.WHOS_NEW:
        return 'Who\'s New?';
      case Task.MEMORY:
        return 'Memory Match';
      case Task.SHUFFLE:
        return 'Shuffle';
      case Task.FORCED_CHOICE:
        return 'Forced Choice';
      case Task.SAME_DIFFERENT:
        return 'Same-Different';
      case Task.PRETEST:
        return 'Pre-Assessment';
      case Task.POSTTEST:
        return 'Post-Assessment';
      default:
        return "Modules"
    }
  }

  async getHelp(displayFirst : boolean) {
    const modal = await this.modalController.create({
      component: HelpModalComponent,
      componentProps: {
        "paramTask": this.getTitle(),
        "displayFirst": displayFirst
      }
    });
    await modal.present();
  }
  
  async showRaceSelect() {
    let raceName = null;
    const modal = await this.modalController.create({
      component: RaceSelectModalComponent,
      componentProps: {
        race: this.currentRace
      } //componentProps: { users: this.users },
    });
    await modal.present();
    await modal.onWillDismiss().then(data=>{
      console.log('data came back from modal');
      console.log(data);
      raceName = data['data'].toLowerCase();
      console.log("raceName is:");
      console.log(raceName);
      //this.submitScores.submitTaskScores(-1, [-1, -1, -1, -1, -1, -1], raceName); // what if user chooses to change race groups throughout the process
    });
    // console.log("Outside, and raceName now is:");
    // console.log(raceName);
    this.submitScores.submitTaskScores(-1, [-1, -1, -1, -1, -1, -1], raceName);
    return raceName;
  }
 
  renderLevelOneHelp() {
    if (this.userLevel == 1) {
      timer(500).subscribe(() => {
        this.getHelp(true);
      });
    }
  }

  async getTrainingFaces() {
    let name = await this.showRaceSelect();
    this.currentRace = name;
    console.log("name is:");
    console.log(name);
    // this.trainingFacePaths = name;
    console.log("passed.");
    let facePaths : string[] = [];
    let imagesAlreadyStored = true;

    for (let i = 0; i < 8; i++) {
      let image = sessionStorage.getItem(`training${i}`);
      if (!image) {
        imagesAlreadyStored = false;
        break;
      } else {
        facePaths.push(image);
      }
    }
    // if (!imagesAlreadyStored) {
    if(true){
      facePaths = [];
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
      };
      //await this.http.put("https://crossfacerecognition.herokuapp.com/getTrainingFaces/", {level: this.userLevel, race: this.currentRace}, httpOptions).subscribe((res) => {
      await this.http.put("https://crossfacerecognition.herokuapp.com/getTrainingFaces/", {level: this.userLevel, race: name}, httpOptions).subscribe((res) => {
        for (let i = 0; i < 8; i++) {
          //clear stack
          facePaths.push(`data:image/png;base64,${res['images'][i]}`)
          sessionStorage.setItem(`training${i}`, `data:image/png;base64,${res['images'][i]}`)
        }
        console.log("photos updated.");
      });
    }
    return facePaths;
  }

  async getWhosNewFaces() {
    let facePaths : string[] = [];

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    await this.http.put("https://crossfacerecognition.herokuapp.com/getWhosNewFaces/", {level: this.userLevel, race: this.currentRace}, httpOptions).subscribe((res) => {
      for (let i = 0; i < 8; i++) {
        facePaths.push(`data:image/png;base64,${res['images'][i]}`)
      }
    });

    return facePaths;
  }
  
  async getDailyAssessmentFaces() {
    let facePaths : string[] = [];
    let imagesAlreadyStored = true;

    for (let i = 0; i < 8; i++) {
      let image = sessionStorage.getItem(`dailyAssessment${i}`);
      if (!image) {
        imagesAlreadyStored = false;
        break;
      } else {
        facePaths.push(image);
      }
    }
    if (!imagesAlreadyStored) {
      facePaths = [];
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
      };
      await this.http.put("https://crossfacerecognition.herokuapp.com/getDailyAssessmentFaces/", {race: this.currentRace}, httpOptions).subscribe((res) => {
        for (let i = 0; i < 8; i++) {
          facePaths.push(`data:image/jpg;base64,${res['images'][i]}`)
          sessionStorage.setItem(`dailyAssessment${i}`, `data:image/jpg;base64,${res['images'][i]}`)
        }
      });
    }
    return facePaths;
  }

  async getPrePostAssessmentFaces() { // Too many to store in local/session storage
    let facePaths : string[] = [];

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    await this.http.put("https://crossfacerecognition.herokuapp.com/getPrePostAssessmentFaces/", {race: this.currentRace}, httpOptions).subscribe((res) => {
      for (let i = 0; i < 30; i++) {
        facePaths.push(`data:image/jpg;base64,${res['images'][i]}`)
      }
    });

    return facePaths;
  }

  finished(score : number[], task : number) {
    console.log("this is finished.")
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
    this.submitScores.submitTaskScores(this.userLevel, this.scores, "black");
  }

  // finished_setRaceName() {
  //   this.showRaceSelect();
  // }

  finishPrePost(score : number[]) {
    if (this.userLevel == 0) {
      this.submitScores.submitPreAssessment(score[0], "black");
    } else if (this.userLevel == 9) {
      this.submitScores.submitPostAssessment(score[0], "black");
    }
    this.finishLevel();
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

  clickStart() {
    if (this.userLevel == 0) {
      this.task = Task.PRETEST;
      timer(500).subscribe(() => {
        this.getHelp(true);
      });
    } else if (this.userLevel == 9) {
      this.task = Task.POSTTEST;
    } else if (this.userLevel > 0 && this.userLevel < 9) {
      this.task = Task.LEARNING;
      this.renderLevelOneHelp();
    }
  }

  finishLevel() {

    this.stage = Stage.DONE;

    let currentTask : Task = this.task;
    this.task = null;

    if (currentTask != Task.POSTTEST) {
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

    } else {
      this.userLevel++;
    }
  }

  trainingNotDone() {
    return this.scores[Task.NAME_FACE] < this.taskLengths[Task.NAME_FACE] * this.minTrainScore ||
      this.scores[Task.WHOS_NEW] < this.taskLengths[Task.WHOS_NEW] * this.minTrainScore  ||
      this.scores[Task.MEMORY] < this.taskLengths[Task.MEMORY] * this.minTrainScore  ||
      this.scores[Task.SHUFFLE] < this.taskLengths[Task.SHUFFLE] * this.minTrainScore
  }

  scheduleNotification() {
    let date = new Date();
    date.setMinutes(0);
    date.setSeconds(0);
    date.setHours(8);
    date.setDate(date.getDate() + 1);
    this.localNotifications.schedule({
      id: 1,
      text: 'You\'re next training is now available!',
      foreground: true,
      trigger: {at: date}
    });
  }
}