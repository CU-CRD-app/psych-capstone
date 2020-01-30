import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-forced-choice',
  templateUrl: './forced-choice.component.html',
  styleUrls: ['./forced-choice.component.scss'],
})
export class ForcedChoiceComponent implements OnInit {
  @Output() finished = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

}
