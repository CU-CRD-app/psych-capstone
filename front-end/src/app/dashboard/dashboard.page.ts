import { Component, ViewChildren } from '@angular/core';
import { ModulesPage } from '../modules/modules.page';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage {
  @ViewChildren('modules') tabRef: ModulesPage;

  constructor() {}

  ngAfterViewInit() {
    this.viewReady = true;
  }

  viewReady : boolean = false;
  loggedIn : boolean = false;

  username : string = 'USERNAME'
  level : number = 1;
  progressToday : number = 0.5;
  
  inTraining() {
    if (this.viewReady) {
      return this.tabRef.stage != this.tabRef.Stage.START && this.tabRef.stage != this.tabRef.Stage.DONE;
    }
  }
}
