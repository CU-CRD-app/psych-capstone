import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-name-face',
  templateUrl: './name-face.component.html',
  styleUrls: ['./name-face.component.scss'],
})
export class NameFaceComponent implements OnInit {
  @Output() finished = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

}
