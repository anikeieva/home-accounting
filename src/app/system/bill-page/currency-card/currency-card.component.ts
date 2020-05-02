import { Component, Input, OnInit } from '@angular/core';
import { Currency } from '../../../shared/models/currency.model';

@Component({
  selector: 'acc-currency-card',
  templateUrl: './currency-card.component.html',
  styleUrls: ['./currency-card.component.scss']
})
export class CurrencyCardComponent implements OnInit {
  @Input() currencies: {
    [key: string]: Currency
  };
  currenciesNames: string[] = ['USD', 'EUR'];

  constructor() { }

  ngOnInit(): void {}

}
