import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { Category } from '../../shared/models/category';
import { AccEvent } from '../../shared/models/event.model';
import { CategoriesService } from '../../shared/services/categories.service';
import { EventsService } from '../../shared/services/events.service';
import { ChartData } from '../../shared/models/chartData';

import { HistoryFilterComponent } from './history-filter/history-filter.component';
import { HistoryFilterData } from '../../shared/models/historyFilterData.model';
import { FormField } from '../../shared/models/formField.model';
import { Moment } from 'moment';
import { CommonComponent } from '../../shared/components/message/common.component';

import * as moment from 'moment';
import StartOf = moment.unitOfTime.StartOf;
import { EventsTypes, EventPeriod } from '../../shared/data/data';

@Component({
  selector: 'acc-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent extends CommonComponent implements OnInit {
  subscriptions: Subscription[] = [];
  isLoaded = false;

  categories: Category[] = [];
  events: AccEvent[] = [];
  filteredEvents: AccEvent[] = [];
  chartData: ChartData[] = [];
  historyFilterData: HistoryFilterData;
  isFilterHasNoMatch = false;

  constructor(
    private categoriesService: CategoriesService,
    private eventsService: EventsService,
    private dialog: MatDialog,
    private title: Title
  ) {
    super();
    this.title.setTitle('History page');
  }

  ngOnInit(): void {
   combineLatest([
      this.categoriesService.getCategories(),
      this.eventsService.getEvents()
    ]).subscribe((data: [Category[], AccEvent[]]) => {
      if (data) {
        this.categories = data[0];
        this.events = data[1];

        this.initHistoryData();
        this.setOriginEvents();
        this.getChartData();

        this.isLoaded = true;
      }
    });
  }

  openHistoryFilter() {
    this.subscriptions.push(
      this.dialog.open(HistoryFilterComponent, {
        data: {
          categories: this.categories,
          historyFilterData: this.historyFilterData
        }
      }).afterClosed().subscribe((historyFilterData: HistoryFilterData) => {
        if (historyFilterData) {
          const checkedPeriodItem: FormField = historyFilterData.period.find((period: FormField) => period.checked);
          this.historyFilterData = historyFilterData;
          this.setOriginEvents();

          this.filteredEvents = this.getFilteredEvents(historyFilterData, this.filteredEvents);

          if (checkedPeriodItem && checkedPeriodItem.type) {
            this.filteredEvents = this.getFilteredEventForTimePeriod(historyFilterData, this.filteredEvents);
          }

          this.getChartData();
          this.getIsFilterHasNoMatch();
        }
      })
    );
  }

  disableFilter() {
    this.initHistoryData();

    this.setOriginEvents();
    this.getIsFilterHasNoMatch();
    this.getChartData();
  }

  getIsFilterHasNoMatch() {
    if (this.historyFilterData && !this.historyFilterData.isEnableFilter) {
      this.isFilterHasNoMatch = false;
      return;
    }

    this.isFilterHasNoMatch = !this.filteredEvents.length;
  }

  private getFilteredEvents(historyFilterData: HistoryFilterData, filteredEvents: AccEvent[]) {
    return filteredEvents.filter((event: AccEvent) => {
      return historyFilterData.eventTypes.some((eventTypeFromFilter: FormField) => {
        return eventTypeFromFilter.checked && eventTypeFromFilter.type === event.type;
      });
    }).filter((event: AccEvent) => {
      return historyFilterData.categories.some((categoryFromFilter: Category) => {
        return categoryFromFilter.checked && +categoryFromFilter.id === event.category;
      });
    });
  }

  private getFilteredEventForTimePeriod(historyFilterData: HistoryFilterData, filteredEvents: AccEvent[]) {
    const checkedPeriodItem: FormField = historyFilterData.period.find((period: FormField) => period.checked);

    if (checkedPeriodItem && checkedPeriodItem.type) {
      const checkedPeriod: StartOf = checkedPeriodItem.type as StartOf;
      const startDate: Moment = moment().startOf(checkedPeriod).startOf('d');
      const endDate: Moment = moment().endOf(checkedPeriod).endOf('d');

      if (startDate && endDate) {
        return filteredEvents.filter((event: AccEvent) => {
          const eventDate: Moment = moment(event.date, 'DD.MM.YYYY HH.mm.ss');

          return eventDate.isBetween(startDate, endDate);
        });
      } else {
        return filteredEvents;
      }
    } else {
      return filteredEvents;
    }
  }

  private initHistoryData() {
    this.historyFilterData = new HistoryFilterData();
    this.historyFilterData.categories = this.categories;

    this.historyFilterData.categories.forEach((category: Category) => {
      category.checked = false;
    });

    this.historyFilterData.eventTypes =  EventsTypes;
    this.historyFilterData.period =  EventPeriod;
  }


  private getChartData(): void {
    this.chartData = [];

    this.categories.forEach((category: Category) => {
      const categoryEvents: AccEvent[] = this.filteredEvents.filter((event: AccEvent) => {
        return event.category === category.id && event.type === 'outcome';
      });
      const chartValue: number = categoryEvents.reduce((acc: number, item: AccEvent) => {
        return acc + item.amount;
      }, 0);

      const chart: ChartData = new ChartData(category.name, chartValue);
      this.chartData.push(chart);
    });
  }

  private setOriginEvents() {
    this.filteredEvents = this.events.slice();
  }
}
