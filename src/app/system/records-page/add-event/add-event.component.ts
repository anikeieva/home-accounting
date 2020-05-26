import { Component, Input, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Category } from '../../../shared/models/category';
import { AccEvent } from '../../../shared/models/event.model';
import * as moment from 'moment';
import { EventsService } from '../../../shared/services/events.service';
import { BillService } from '../../../shared/services/bill.service';
import { Bill } from '../../../shared/models/bill.model';
import { Message } from '../../../shared/models/message.model';
import { FormField } from '../../../shared/models/formField.model';
import { MessageType } from '../../../shared/models/messageType';
import { CommonComponent } from '../../../shared/components/message/common.component';

@Component({
  selector: 'acc-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent extends CommonComponent implements OnInit {
  @Input() categories: Category[] = [];

  types: FormField[] = [
    {type: 'income', label: 'Income'},
    {type: 'outcome', label: 'Outcome'}
  ];
  message: Message;
  subscriptions: Subscription[] = [];

  constructor(private eventsService: EventsService,
              private billService: BillService) {
    super();
  }

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (form) {
      const { type, amount, category, description } = form.value;
      const date: string = moment().format('DD.MM.YYYY HH.mm.ss');
      const event: AccEvent = new AccEvent(type, amount, category, date, description);

      if (event) {
        this.subscriptions.push(
          this.billService.getBill()
            .subscribe((bill: Bill) => {
              this.handleBill(bill, type, amount, event, form);
            })
        );
      }
    }
  }

  onChangeAmount(amount: NgModel) {
    if (amount.control.value < 0) {
      const positiveValue = amount.control.value * -1;
      amount.control.setValue(positiveValue);
    }
  }

  private handleBill(bill: Bill, type: string, amount: number, event: AccEvent, form: NgForm) {
    if (bill && bill.value) {
      let value: number;
      if (type.includes('outcome')) {
        if (amount > bill.value) {
          const missingAmount: number = amount - bill.value;
          this.getMessage(`Not enough money. You are missing ${missingAmount} ${bill.currency}`, MessageType.danger);

          return;
        } else {
          value = bill.value - amount;
        }
      } else {
        value = bill.value + amount;
      }

      this.updateBill(value, bill, event, form);
    }
  }

  private updateBill(value, bill: Bill, event: AccEvent, form: NgForm) {
    const updatedBill: Bill = new Bill(value, bill.currency);

    this.subscriptions.push(
      this.billService.updateBill(updatedBill)
        .pipe(
          mergeMap(() => this.eventsService.addEvent(event))
        ).subscribe(() => {
        form.setValue({
          category: 1,
          type: 'outcome',
          amount: 1,
          description: ' '
        });
      })
    );
  }

}
