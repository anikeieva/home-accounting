import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { EventsService } from '../../../shared/services/events.service';
import { CategoriesService } from '../../../shared/services/categories.service';
import { mergeMap } from 'rxjs/operators';
import { AccEvent } from '../../../shared/models/event.model';
import { Category } from '../../../shared/models/category';
import { Title } from '@angular/platform-browser';
import { CommonComponent } from '../../../shared/components/message/common.component';

@Component({
  selector: 'acc-history-details',
  templateUrl: './history-details.component.html',
  styleUrls: ['./history-details.component.scss']
})
export class HistoryDetailsComponent extends CommonComponent implements OnInit {
  subscriptions: Subscription[] = [];
  event: AccEvent;
  category: Category;
  isLoaded = false;

  constructor(private route: ActivatedRoute,
              private eventsService: EventsService,
              private categoriesService: CategoriesService,
              private title: Title) {
    super();
    this.title.setTitle('Event detail page');
  }

  ngOnInit(): void {
    this.route.params.pipe(
      mergeMap((params: Params) => {
        console.log(params.id);
        return this.eventsService.getEventById(params.id);
      }),
      mergeMap((event: AccEvent) => {
        this.event = event;
        return this.categoriesService.getCategoryById(this.event.category);
      })
    ).subscribe((category: Category) => {
      this.category = category;
      this.isLoaded = true;
    });
  }
}
