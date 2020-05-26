import { FormField } from '../models/formField.model';

export const EventsTypes: FormField[] = [
  { type: 'outcome', label: 'Outcome', checked: false },
  { type: 'income', label: 'Income', checked: false }
];

export const EventPeriod: FormField[] = [
  { type: '', label: 'None', checked: true },
  { type: 'd', label: 'Day', checked: false },
  { type: 'w', label: 'Week', checked: false },
  { type: 'M', label: 'Month', checked: false }
];

export const currencyCodesAByName = {
  UAH: 980,
  USD: 840,
  EUR: 978
};

export const currencyCodesA = {
  980: 'UAH',
  840: 'USD',
  978: 'EUR'
};
