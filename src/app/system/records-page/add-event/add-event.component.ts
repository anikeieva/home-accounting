import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForm, NgModel} from '@angular/forms';

import {Category} from '../../../shared/models/category';
import {AccEvent} from '../../../shared/models/event.model';
import * as moment from 'moment';
import {EventsService} from '../../../shared/services/events.service';
import {BillService} from '../../../shared/services/bill.service';
import {Bill} from '../../../shared/models/bill.model';
import {mergeMap} from 'rxjs/operators';
import {Message} from '../../../shared/models/message.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'acc-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {
  @Input() categories: Category[] = [];

  types = [
    {type: 'income', label: 'Income'},
    {type: 'outcome', label: 'Outcome'}
  ];
  message: Message;
  subscriptions: Subscription[] = [];

  constructor(private eventsService: EventsService,
              private billService: BillService) { }

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
              if (bill && bill.value) {
                let value: number;
                if (type.includes('outcome')) {
                  if (amount > bill.value) {
                    const missingAmount: number = amount - bill.value;
                    this.getMessage(`Not enough money. You are missing ${missingAmount} ${bill.currency}`, 'danger');

                    return;
                  } else {
                    value = bill.value - amount;
                  }
                } else {
                  value = bill.value + amount;
                }

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

  private getMessage(text: string, type: string) {
    this.message = new Message(type, text);

    setTimeout(() => {
      this.message.text = '';
    }, 5000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

}
