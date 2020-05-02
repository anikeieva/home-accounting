import { Component, Input, OnInit } from '@angular/core';

import { Bill } from '../../../shared/models/bill.model';
import { Currency } from '../../../shared/models/currency.model';

@Component({
  selector: 'acc-bill-card',
  templateUrl: './bill-card.component.html',
  styleUrls: ['./bill-card.component.scss']
})
export class BillCardComponent implements OnInit {
  @Input() bill: Bill;
  @Input() currencies: {
    [key: string]: Currency
  };

  dollar = 0;
  euro = 0;

  constructor() { }

  ngOnInit(): void {
    if (this.bill && this.currencies) {
      const billValue: number = this.bill.value;
      const dollarInfo: Currency = this.currencies.USD;
      const euroInfo: Currency = this.currencies.EUR;

      if (billValue && dollarInfo && euroInfo) {
        this.dollar = dollarInfo.rate && billValue / dollarInfo.rate;
        this.euro = euroInfo.rate && billValue / euroInfo.rate;
      }
    }
  }
}
