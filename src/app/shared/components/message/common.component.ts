import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageType } from '../../models/messageType';
import { Message } from '../../models/message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'acc-common-component',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss']
})
export class CommonComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  message?: Message;

  constructor() {}

  ngOnInit(): void {}

  getMessage(text: string, type: string = MessageType.danger) {
    this.message = new Message(type, text);

    setTimeout(() => {
      this.resetMessageText();
    }, 5000);
  }

  resetMessageText() {
    if (this.message && this.message.text) {
      this.message.text = '';
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

}
