import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubmitScoresService {

  constructor(public http : HttpClient) { }

  scores_url : string = "https://crossfacerecognition.herokuapp.com/tasks/";
  pre_url : string = "https://crossfacerecognition.herokuapp.com/preassessment/";
  post_url : string = "https://crossfacerecognition.herokuapp.com/postassessment/";

  //general
  race : string;
  body : any;
  //tasks
  level : number;
  shuffle : number = 0;
  memory : number = 0;
  whosnew : number = 0;
  nameface : number = 0;
  forcedchoice : number = 0;
  samedifferent : number = 0;
  //pre_assessment
  pre_score : number = 0;
  //post_assessment
  post_score : number = 0;

  //scores array is like:
  //[nameface, whosnew, memory, shuffle, forcedchoice, samedifferent]


  /**********************************************
  TASKS
    To submit scores, inject this service into the component that needs to submit,
      then call this.submitScores.submitTaskScores(level, scores, race)
      where level is a number, scores is an array of scores in the order
      of the normal scores array, and race is a string defaulted to "Black".
  **********************************************/
  /**********************************************
  PRE and POST
    To submit scores, inject, then call either submitPreAssessment or submitPostAssessment
    Both functions take (score: number, race: string (optional, default "Black"))
  **********************************************/

  //TASKS
  setScores(level: number, scores: number[], race: string = "black"): Promise<any> {
    let promise = new Promise<void>((resolve, reject) => {
      this.level = level;
      this.race = race;
      this.nameface = scores[0];
      this.whosnew = scores[1];
      this.memory = scores[2];
      this.shuffle = scores[3];
      this.forcedchoice = scores[4];
      this.samedifferent = scores[5];

      this.body = {
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

  async putScores(level: number, scores: number[], race: string = "black") {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
      };

    await this.setScores(level, scores, race);

    console.log("Sent: ", JSON.stringify(this.body));
    this.http.post(this.scores_url, this.body, httpOptions).subscribe((response: Response) => {
      console.log("Response: ", response);
    }, (err) => {
      console.log("Error: ", err);
    });
  }

  submitTaskScores(level: number, scores : number[], race: string = "black")
  {
    this.putScores(level, scores, race);
  }


  //PRE-ASSESSMENT
  setPre(score: number, race: string = "black"): Promise<any>{
    let promise = new Promise<void>((resolve, reject) => {
      this.pre_score = score;
      this.race = race;

      this.body = {
        "score": this.pre_score,
        "race": this.race
      }

      resolve();
    });

    return promise;
  }

  async submitPreAssessment(score: number, race: string = "black") {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };

    await this.setPre(score, race);

    console.log("Sent to pre: ", JSON.stringify(this.body));
    this.http.put(this.pre_url, this.body, httpOptions).subscribe((response: Response) => {
      console.log("Response: ", response);
      console.log("status: ", response.status);
    }, (err) => {
      console.log("Error: ", err);
    });
  }

  //POST-ASSESSMENT
  setPost(score: number, race: string = "black"): Promise<any>{
    let promise = new Promise<void>((resolve, reject) => {
      this.post_score = score;
      this.race = race;

      this.body = {
        "score": this.post_score,
        "race": this.race
      }

      resolve();
    });

    return promise;
  }

  async submitPostAssessment(score: number, race: string = "black") {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };

    await this.setPost(score, race);

    console.log("Sent to post: ", JSON.stringify(this.body));
    this.http.put(this.post_url, this.body, httpOptions).subscribe((response: Response) => {
      console.log("Response: ", response);
      console.log("status: ", response.status);
    }, (err) => {
      console.log("Error: ", err);
    });
  }

}
