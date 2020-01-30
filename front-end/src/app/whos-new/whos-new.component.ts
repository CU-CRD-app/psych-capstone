import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-whos-new',
  templateUrl: './whos-new.component.html',
  styleUrls: ['./whos-new.component.scss'],
})
export class WhosNewComponent implements OnInit {
  @Output() finished = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

}
