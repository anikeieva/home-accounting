import { Category } from './category';
import { FormField } from './formField.model';

export class HistoryFilterData {
  constructor(
    public isEnableFilter: boolean = false,
    public eventTypes: FormField[] = [],
    public categories: Category[] = [],
    public period: FormField[] = []
  ) {
  }
}
