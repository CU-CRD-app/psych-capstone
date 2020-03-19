import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardPage } from './dashboard.page';
import { LoginComponent } from '../login/login.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path: '', component: DashboardPage}])
  ],
  declarations: [DashboardPage, LoginComponent]
})
export class DashboardPageModule {}
``