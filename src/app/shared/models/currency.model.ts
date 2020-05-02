export class Currency {
  constructor(
    public currency: string,
    public currencyCodeA: number,
    public rate: number,
    public date: Date
  ) {
  }
}
