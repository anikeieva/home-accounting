import * as moment from 'moment';
import StartOf = moment.unitOfTime.StartOf;

export interface FormField {
  type: string | StartOf;
  label: string;
  checked?: boolean;
}
