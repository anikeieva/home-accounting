import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../../models/message.model';
import { fadeStateTrigger } from '../../animations/fade.animation';

@Component({
  selector: 'acc-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss'],
  animations: [fadeStateTrigger]
})
export class AlertMessageComponent implements OnInit {
  @Input() message: Message;

  constructor() {}

  ngOnInit(): void {}
}
