import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Subscription} from 'rxjs';
import {Category} from '../../shared/models/category';
import {AccEvent} from '../../shared/models/event.model';
import {CategoriesService} from '../../shared/services/categories.service';
import {EventsService} from '../../shared/services/events.service';
import {ChartData} from '../../shared/models/chartData';

@Component({
  selector: 'acc-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  isLoaded = false;

  categories: Category[] = [];
  events: AccEvent[] = [];
  chartData: ChartData[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private eventsService: EventsService
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.categoriesService.getCategories(),
      this.eventsService.getEvents()
    ]).subscribe((data: [Category[], AccEvent[]]) => {
      if (data) {
        this.categories = data[0];
        this.events = data[1];
        this.getChartData();

        this.isLoaded = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  private getChartData(): void {
    this.chartData = [];

    this.categories.forEach((category: Category) => {
      const categoryEvents: AccEvent[] = this.events.filter((event: AccEvent) => {
        return event.category === category.id && event.type === 'outcome';
      });
      const chartValue: number = categoryEvents.reduce((acc: number, item: AccEvent) => {
        return acc + item.amount;
      }, 0);

      const chart: ChartData = new ChartData(category.name, chartValue);
      this.chartData.push(chart);
    });
  }
}
