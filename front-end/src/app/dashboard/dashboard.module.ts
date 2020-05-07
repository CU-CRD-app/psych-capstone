import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardPage } from './dashboard.page';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path: '', component: DashboardPage}])
  ],
  declarations: [DashboardPage],
  providers: [LocalNotifications]
})
export class DashboardPageModule {}
``