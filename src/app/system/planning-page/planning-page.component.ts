import { Component, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { BillService } from '../../shared/services/bill.service';
import { CategoriesService } from '../../shared/services/categories.service';
import { EventsService } from '../../shared/services/events.service';
import { Bill } from '../../shared/models/bill.model';
import { Category } from '../../shared/models/category';
import { AccEvent } from '../../shared/models/event.model';
import { Title } from '@angular/platform-browser';
import { MessageType } from '../../shared/models/messageType';
import { CommonComponent } from '../../shared/components/message/common.component';

@Component({
  selector: 'acc-planning-page',
  templateUrl: './planning-page.component.html',
  styleUrls: ['./planning-page.component.scss']
})
export class PlanningPageComponent extends CommonComponent implements OnInit {
  subscriptions: Subscription[] = [];
  isLoaded = false;
  bill: Bill;
  categories: Category[];
  events: AccEvent[];

  constructor(
    private billService: BillService,
    private categoriesService: CategoriesService,
    private eventsService: EventsService,
    private title: Title
  ) {
    super();
    this.title.setTitle('Planning page');
  }

  ngOnInit(): void {
    this.subscriptions.push(
      combineLatest([
        this.billService.getBill(),
        this.categoriesService.getCategories(),
        this.eventsService.getEvents()
      ]).subscribe((data: [Bill, Category[], AccEvent[]]) => {
        this.bill = data[0];
        this.categories = data[1];
        this.events = data[2];

        this.isLoaded = true;
      })
    );
  }

  getCategoryCost(category: Category): number {
    const categoryEvents: AccEvent[] = this.events.filter((event: AccEvent) => {
      return event && (event.category === category.id) && event.type === 'outcome';
    });

    return categoryEvents.reduce((acc: number, item: AccEvent) => {
      return acc + item.amount;
    }, 0);
  }

  getPercentString(category: Category): string {
    return this.getCategoryPercent(category) + '%';
  }

  getCategoryClassColor(category: Category): string {
    const percent: number = this.getCategoryPercent(category);
    return percent < 60 ? MessageType.success : percent >= 100 ? MessageType.danger : MessageType.warning;
  }

  private getCategoryPercent(category: Category): number {
    if (!category) {
      return 0;
    }

    const percent: number = (100 * this.getCategoryCost(category)) / category.limit;
    const resultPercent: number = percent > 100 ? 100 : percent;

    return Math.round(resultPercent);
  }

}
