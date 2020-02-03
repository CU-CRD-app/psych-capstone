import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-whos-new',
  templateUrl: './whos-new.component.html',
  styleUrls: ['./whos-new.component.scss'],
})
export class WhosNewComponent implements OnInit {
  @Input() setNames : string;
  @Output() finished = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {}

  score : number = 0;

}
