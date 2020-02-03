import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-memory-match',
  templateUrl: './memory-match.component.html',
  styleUrls: ['./memory-match.component.scss'],
})
export class MemoryMatchComponent implements OnInit {
  @Input() setNames : string;
  @Output() finished = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {}

  score : number = 0;

}
