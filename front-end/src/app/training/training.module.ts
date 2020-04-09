import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrainingPage } from './training.page';
import { LearningTaskComponent } from '../learning-task/learning-task.component';
import { NameFaceComponent } from '../name-face/name-face.component';
import { WhosNewComponent } from '../whos-new/whos-new.component';
import { MemoryMatchComponent } from '../memory-match/memory-match.component';
import { ShuffleComponent } from '../shuffle/shuffle.component';
import { ForcedChoiceComponent } from '../forced-choice/forced-choice.component';
import { SameDifferentComponent } from '../same-different/same-different.component';
import { ScorePageComponent } from '../score-page/score-page.component';
import { HelpModalComponent } from '../help-modal/help-modal.component';
<<<<<<< HEAD
=======
import { PrePostAssessmentComponent } from '../pre-post-assessment/pre-post-assessment.component';
<<<<<<< HEAD
<<<<<<< HEAD
import { ScorePageComponent } from '../score-page/score-page.component';
>>>>>>> Login and register are working, much improved error messages associated with login
=======
>>>>>>> bypass login button added for when server is unavailable
=======
import { ScorePageComponent } from '../score-page/score-page.component';
>>>>>>> Login and register are working, much improved error messages associated with login
import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: TrainingPage }])
  ],
  declarations: [
    TrainingPage,
    LearningTaskComponent,
    NameFaceComponent,
    WhosNewComponent,
    MemoryMatchComponent,
    ShuffleComponent,
    ForcedChoiceComponent,
    SameDifferentComponent,
    ScorePageComponent,
    HelpModalComponent
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ],
  entryComponents: [HelpModalComponent]
})
export class TrainingPageModule {}
