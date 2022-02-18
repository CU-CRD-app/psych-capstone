import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastController} from '@ionic/angular';




@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {

  scoreList = [];
  base_url : string = environment.backendBaseUrl;
  getHiscores_url: string = this.base_url + "getHiscores/";

  constructor(public http : HttpClient, public toastController : ToastController) { }

  async dangerToast(toastMessage : string) {
    const toast = await this.toastController.create({
      message: toastMessage,
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }

  updateSelection(event) {
    this.changeGame(event.detail.value);

  }

  changeGame(gamemode) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8'
      }),
      responseType: 'text' as 'text'
    };
    const httpBody = {
      "gamemode":gamemode
    }
    this.http.post(this.getHiscores_url, httpBody, httpOptions).subscribe(result => {
      let resultArray = JSON.parse(result);
      this.scoreList = resultArray;
    }, (err) => {
          this.dangerToast("Error fetching hiscores.");
    });

  }

  ngOnInit() {
    this.scoreList = []
    this.changeGame("nameface")
  }

}
