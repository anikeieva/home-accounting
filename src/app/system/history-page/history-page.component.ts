import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, Subscription } from 'rxjs';

import { Category } from '../../shared/models/category';
import { AccEvent } from '../../shared/models/event.model';
import { CategoriesService } from '../../shared/services/categories.service';
import { EventsService } from '../../shared/services/events.service';
import { ChartData } from '../../shared/models/chartData';
import { HistoryFilterComponent } from './history-filter/history-filter.component';
import { HistoryFilterData } from '../../shared/models/historyFilterData.model';
import { FormField } from '../../shared/models/formField.model';
import * as moment from 'moment';
import { Moment } from 'moment';
import StartOf = moment.unitOfTime.StartOf;

@Component({
  selector: 'acc-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

  constructor(
    private categoriesService: CategoriesService,
    private eventsService: EventsService,
    private dialog: MatDialog
  ) { }

  subscriptions: Subscription[] = [];
  isLoaded = false;

  categories: Category[] = [];
  events: AccEvent[] = [];
  filteredEvents: AccEvent[] = [];
  chartData: ChartData[] = [];
  historyFilterData: HistoryFilterData;

  private static getEventsTypes(): FormField[] {
    return [
      { type: 'outcome', label: 'Outcome', checked: false },
      { type: 'income', label: 'Income', checked: false }
    ];
  }

  private static getPeriod(): FormField[] {
    return [
      { type: 'd', label: 'Day', checked: false },
      { type: 'w', label: 'Week', checked: false },
      { type: 'M', label: 'Month', checked: false }
    ];
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
          this.historyFilterData = historyFilterData;
          console.log(historyFilterData);
          this.setOriginEvents();

          const checkedPeriodItem: FormField = historyFilterData.period.find((period: FormField) => period.checked);

          this.filteredEvents = this.filteredEvents.filter((event: AccEvent) => {
            return historyFilterData.eventTypes.some((eventTypeFromFilter: FormField) => {
              return eventTypeFromFilter.checked && eventTypeFromFilter.type === event.type;
            });
          })
            .filter((event: AccEvent) => {
              return historyFilterData.categories.some((categoryFromFilter: Category) => {
                return categoryFromFilter.checked && +categoryFromFilter.id === event.category;
              });
            });

          if (checkedPeriodItem) {
            const checkedPeriod: StartOf = checkedPeriodItem.type as StartOf;
            const startDate: Moment = moment().startOf(checkedPeriod).startOf('d');
            const endDate: Moment = moment().endOf(checkedPeriod).endOf('d');

            if (startDate && endDate) {
              this.filteredEvents = this.filteredEvents.filter((event: AccEvent) => {
                const eventDate: Moment = moment(event.date, 'DD.MM.YYYY HH.mm.ss');

                return eventDate.isBetween(startDate, endDate);
              });
            }
          }

          this.getChartData();
        }
      })
    );
  }

  disableFilter() {
    this.initHistoryData();

    this.setOriginEvents();
    this.getChartData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  private initHistoryData() {
    this.historyFilterData = new HistoryFilterData();
    this.historyFilterData.categories = this.categories;

    this.historyFilterData.categories.forEach((category: Category) => {
      category.checked = false;
    });

    this.historyFilterData.eventTypes =  HistoryPageComponent.getEventsTypes();
    this.historyFilterData.period =  HistoryPageComponent.getPeriod();
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
