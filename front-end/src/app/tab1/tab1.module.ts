import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { LearningTaskComponent } from '../learning-task/learning-task.component';
import { NameFaceComponent } from '../name-face/name-face.component';
import { WhosNewComponent } from '../whos-new/whos-new.component';
import { MemoryMatchComponent } from '../memory-match/memory-match.component';
import { ShuffleComponent } from '../shuffle/shuffle.component';
import { ForcedChoiceComponent } from '../forced-choice/forced-choice.component';
import { SameDifferentComponent } from '../same-different/same-different.component';
import { HomeComponent } from '../home/home.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }])
  ],
  declarations: [
    Tab1Page,
    LearningTaskComponent,
    NameFaceComponent,
    WhosNewComponent,
    MemoryMatchComponent,
    ShuffleComponent,
    ForcedChoiceComponent,
    SameDifferentComponent,
    HomeComponent
  ]
})
export class Tab1PageModule {}
