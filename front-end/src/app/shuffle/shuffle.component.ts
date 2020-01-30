import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-shuffle',
  templateUrl: './shuffle.component.html',
  styleUrls: ['./shuffle.component.scss'],
})
export class ShuffleComponent implements OnInit {
  @Output() finished = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

}
