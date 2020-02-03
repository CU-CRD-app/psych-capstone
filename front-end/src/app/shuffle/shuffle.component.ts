import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-shuffle',
  templateUrl: './shuffle.component.html',
  styleUrls: ['./shuffle.component.scss'],
})
export class ShuffleComponent implements OnInit {
  @Input() setNames : string;
  @Output() finished = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {}

  score : number = 0;

}
