import { Component, OnInit } from '@angular/core';
import { BillService } from '../../shared/services/bill.service';
import { CurrencyInfoMonobank } from '../../shared/models/currencyInfoMonobank';
import { combineLatest, Subscription } from 'rxjs';
import { Bill } from '../../shared/models/bill.model';
import { Currency } from '../../shared/models/currency.model';
import { Title } from '@angular/platform-browser';
import { CommonComponent } from '../../shared/components/message/common.component';
import { currencyCodesA, currencyCodesAByName } from '../../shared/data/data';

@Component({
  selector: 'acc-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.scss']
})
export class BillPageComponent extends CommonComponent implements OnInit {
  subscription: Subscription[] = [];
  bill: Bill;
  isLoaded = false;
  failedToLoadText = '';

  currencies: {
    [key: string]: Currency
  };

  constructor(
    private  billService: BillService,
    private title: Title
  ) {
    super();
    this.title.setTitle('Bill page');
  }

  ngOnInit(): void {
    this.subscription.push(
      combineLatest([
        this.billService.getBill(),
        this.billService.getCurrency()
      ]).subscribe((data: [Bill, CurrencyInfoMonobank[]]) => {
        if (data) {
          this.bill = data[0];
          const currenciesMonobank: CurrencyInfoMonobank[] = data[1];

          this.getCurrencies(currenciesMonobank);
          this.isLoaded = true;
        }
      }, this.ifCurrenciesRejected.bind(this))
    );
  }

  private getCurrencies(currenciesMonobank: CurrencyInfoMonobank[]) {
    this.currencies = {};

    if (currenciesMonobank) {
      currenciesMonobank.forEach((currency: CurrencyInfoMonobank) => {
        if (currency && currency.currencyCodeB === currencyCodesAByName.UAH &&
          (currency.currencyCodeA === currencyCodesAByName.USD ||
            currency.currencyCodeA === currencyCodesAByName.EUR)) {
          const currencyName: string = currencyCodesA[currency.currencyCodeA];
          const rate: number = currency.rateCross || (currency.rateBuy + currency.rateSell) / 2;
          const date: Date = (currency.date && new Date(currency.date * 1000)) || new Date();

          this.currencies[currencyName] = new Currency(currencyName, currency.currencyCodeA, rate, date);
        }
      });
    }
  }

  onRefresh() {
    this.isLoaded = false;

    this.subscription.push(
      this.billService.getCurrency()
        .subscribe((currenciesMonobank: CurrencyInfoMonobank[]) => {
          if (currenciesMonobank) {
            this.getCurrencies(currenciesMonobank);
          }

          this.isLoaded = true;
        }, this.ifCurrenciesRejected.bind(this))
    );
  }

  private ifCurrenciesRejected(errorMessage: string) {
    this.isLoaded = false;
    this.failedToLoadText = errorMessage ? errorMessage + '. Try again in a minute' : 'Try again in a minute';
  }
}
