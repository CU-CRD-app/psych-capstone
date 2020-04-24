import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubmitScoresService {

  constructor(public http : HttpClient) { }

  scores_url : string = "https://crossfacerecognition.herokuapp.com/tasks/"

  token : any;
  level : number;
  race : string;
  shuffle : number = 0;
  memory : number = 0;
  whosnew : number = 0;
  nameface : number = 0;
  forcedchoice : number = 0;
  samedifferent : number = 0;
  body : any;
  //scores array is like:
  //[nameface, whosnew, memory, shuffle, forcedchoice, samedifferent]


  /**********************************************

  To submit scores, inject this service into the component that needs to submit,
    then call this.submitScores.submitTaskScores(token, level, scores, race)
    where token and level are numbers, scores is an array of scores in the order
    of the normal scores array, and race is a string defaulted to "Black".

  **********************************************/

  setScores(token: any, level: number, scores: number[], race: string = "Black"): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.token = token;
      this.level = level;
      this.race = race;
      this.nameface = scores[0];
      this.whosnew = scores[1];
      this.memory = scores[2];
      this.shuffle = scores[3];
      this.forcedchoice = scores[4];
      this.samedifferent = scores[5];

      this.body = {
        "token": this.token,
        "level": this.level,
        "race": this.race,
        "shuffle": this.shuffle,
        "memory": this.memory,
        "whosnew": this.whosnew,
        "nameface": this.nameface,
        "forcedchoice": this.forcedchoice,
        "samedifferent": this.samedifferent
      };

      resolve();
    });
    return promise;
  }

  async putScores(token: any, level: number, scores: number[], race: string = "Black") {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8'
        })
      };

    await this.setScores(token, level, scores, race);

    console.log("Sent: ", JSON.stringify(this.body));
    this.http.post(this.scores_url, this.body, httpOptions).subscribe((response: Response) => {
      console.log("Response: ", response);
    }, (err) => {
      console.log("Error: ", err);
    });
  }

  submitTaskScores(token: any, level: number, scores : number[], race: string = "Black")
  {
    this.putScores(token, level, scores, race);
  }

}
