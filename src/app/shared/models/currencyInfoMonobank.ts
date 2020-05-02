export class CurrencyInfoMonobank {
  constructor(
    public currencyCodeA: number,
    public currencyCodeB: number,
    public date: number,
    public rateSell: number,
    public rateBuy: number,
    public rateCross: number
  ) {
  }
}
