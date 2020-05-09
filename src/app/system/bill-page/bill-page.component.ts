import {Component, OnDestroy, OnInit} from '@angular/core';
import {BillService} from '../../shared/services/bill.service';
import {CurrencyInfoMonobank} from '../../shared/models/currencyInfoMonobank';
import {combineLatest, Subscription} from 'rxjs';
import {Bill} from '../../shared/models/bill.model';
import {Currency} from '../../shared/models/currency.model';

@Component({
  selector: 'acc-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.scss']
})
export class BillPageComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  bill: Bill;
  isLoaded = false;
  loadingText = 'Loading...';

  currencyCodesAByName = {
    UAH: 980,
    USD: 840,
    EUR: 978
  };

  currencyCodesA = {
    980: 'UAH',
    840: 'USD',
    978: 'EUR'
  };

  currencies: {
    [key: string]: Currency
  };

  constructor(
    private  billService: BillService
  ) { }

  ngOnInit(): void {
    this.subscription.push(
      combineLatest([
        this.billService.getBill(),
        this.billService.getCurrency()
      ]).subscribe((data: [Bill, CurrencyInfoMonobank[]]) => {
        if (data) {
          console.log(data);
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
        if (currency && currency.currencyCodeB === this.currencyCodesAByName.UAH &&
          (currency.currencyCodeA === this.currencyCodesAByName.USD ||
            currency.currencyCodeA === this.currencyCodesAByName.EUR)) {
          const currencyName: string = this.currencyCodesA[currency.currencyCodeA];
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

  ngOnDestroy() {
    this.subscription.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  private ifCurrenciesRejected(errorMessage: string) {
    this.isLoaded = false;
    this.loadingText = errorMessage ? errorMessage + '. Try again in a minute' : 'Try again in a minute';
  }
}
