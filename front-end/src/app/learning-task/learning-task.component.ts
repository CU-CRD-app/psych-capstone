import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { timer } from 'rxjs';
import { createAnimation } from '@ionic/core';

@Component({
  selector: 'app-learning-task',
  templateUrl: './learning-task.component.html',
  styleUrls: ['./learning-task.component.scss'],
})
export class LearningTaskComponent implements OnInit {
  @Input() setNames : string;
  @Input() facePaths : string[];
  @Output() finished = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {
    timer(1000).subscribe(async () => {
      let fadeIn = createAnimation()
        .addElement(document.querySelectorAll('.footer'))
        .fill('none')
        .duration(500)
        .fromTo('opacity', '0', '1');
      if (this.progress == 0) {
        await fadeIn.play();
        Array.from(document.getElementsByClassName('footer') as HTMLCollectionOf<HTMLElement>)[0].style.opacity = '1';  
      }
    });
  }

  progress : number = 0;
  progressPercent : number = 0;

  seenAll : boolean = false;
  swiped : boolean = false;

  changeCard(direction : string) {
    this.swiped = true;
    if (direction == 'next') {
      this.progress++;
    } else {
      this.progress--;
    }
    if (!this.seenAll) {
      this.progressPercent = this.progress/(this.facePaths.length - 1);
    }
    if (this.progress == 7) {
      this.seenAll = true;
    }
  }

}
