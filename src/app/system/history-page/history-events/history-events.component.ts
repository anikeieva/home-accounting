import { Component, Input, OnInit } from '@angular/core';

import { Category } from '../../../shared/models/category';
import { AccEvent } from '../../../shared/models/event.model';

@Component({
  selector: 'acc-history-events',
  templateUrl: './history-events.component.html',
  styleUrls: ['./history-events.component.scss']
})
export class HistoryEventsComponent implements OnInit {
  searchValue = '';
  searchPlaceholder = '';
  searchField = '';

  @Input() categories: Category[] = [];
  @Input() events: AccEvent[] = [];

  constructor() { }

  ngOnInit(): void {
    this.getSearchValue('amount');

    this.events.forEach(((event: AccEvent) => {
      const categoryFromEvent: Category = this.categories.find((category) => {
        return category.id === event.category;
      });

      event.categoryName = categoryFromEvent && categoryFromEvent.name;
    }));
  }

  getEventClass(event: AccEvent) {
    return {
      label: true,
      'label-danger': event.type === 'outcome',
      'label-success': event.type === 'income'
    };
  }

  getSearchValue(value: string) {
    const searchValuesMap = {
      amount: 'Amount',
      categoryName: 'Category',
      date: 'Date',
      type: 'Type'
    };

    this.searchPlaceholder = searchValuesMap[value];
    this.searchField = value;
  }

}
