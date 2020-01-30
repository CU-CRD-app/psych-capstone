import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-same-different',
  templateUrl: './same-different.component.html',
  styleUrls: ['./same-different.component.scss'],
})
export class SameDifferentComponent implements OnInit {
  @Output() finished = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

}
