import { Pipe, PipeTransform } from '@angular/core';

import { AccEvent } from '../models/event.model';
import { MomentPipe } from './moment.pipe';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(events: AccEvent[], value: string, field: string): AccEvent[] {
    if (!events.length || !value) {
      return events;
    }

    return events.filter((event: AccEvent) => {
      let eventValue: any = event[field];

      if (field === 'date') {
        eventValue = new MomentPipe().transform(eventValue, 'DD.MM.YY HH:mm:ss');
        console.log(value);
      } else if (typeof eventValue === 'number') {
        eventValue = eventValue.toString();
      } else if (typeof eventValue !== 'string') {
        eventValue = null;
      }

      const eventValueLowerCase = eventValue && eventValue.toLocaleLowerCase();
      return eventValueLowerCase && eventValueLowerCase.includes(value.toLowerCase());
    });
  }

}
