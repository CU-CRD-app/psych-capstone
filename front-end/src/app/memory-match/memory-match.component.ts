import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-memory-match',
  templateUrl: './memory-match.component.html',
  styleUrls: ['./memory-match.component.scss'],
})
export class MemoryMatchComponent implements OnInit {
  @Output() finished = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

}
