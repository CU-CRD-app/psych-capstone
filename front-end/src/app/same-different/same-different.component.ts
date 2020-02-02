import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-same-different',
  templateUrl: './same-different.component.html',
  styleUrls: ['./same-different.component.scss'],
})
export class SameDifferentComponent implements OnInit {
  @Input() setNames : string;
  @Output() finished = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {}

  score : number = 0;

}
