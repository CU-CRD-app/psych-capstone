import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastController} from '@ionic/angular';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.page.html',
  styleUrls: ['./achievements.page.scss'],
})
export class AchievementsPage implements OnInit {

  achievementList = [];
  base_url : string = environment.backendBaseUrl;
  getHiscores_url: string = this.base_url + "get_achievements/";

  constructor(public http : HttpClient, public toastController : ToastController) { }

  async dangerToast(toastMessage : string) {
    const toast = await this.toastController.create({
      message: toastMessage,
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }

  getAchievements() {
    console.log("TEST")
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }),
      responseType: 'text' as 'text'
    };
    const httpBody = {
    }
    this.http.post(this.getHiscores_url, httpBody, httpOptions).subscribe(result => {
      let resultArray = JSON.parse(result);
      this.achievementList = resultArray.result;
    }, (err) => {
          this.dangerToast("Error fetching achievements.");
    });

  }

  ngOnInit() {
    this.achievementList = []
    this.getAchievements()
  }

}
