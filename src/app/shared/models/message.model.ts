export class Message {
  constructor(
    public type: string,
    public text: string,
    public delay?: number
  ) {}
}
