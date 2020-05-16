import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgForm, NgModel} from '@angular/forms';
import {Subscription} from 'rxjs';

import {Category} from '../../../shared/models/category';
import {CategoriesService} from '../../../shared/services/categories.service';
import {Message} from '../../../shared/models/message.model';

@Component({
  selector: 'acc-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  @Input() categories: Category[] = [];
  @Output() editNewCategory = new EventEmitter<Category>();

  currentCategoryId = 1;
  currentCategory: Category;
  message: Message;

  constructor(
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.onCategoryChange();
  }

  onSubmit(form: NgForm) {
    if (form) {
      const { name, limit } = form.value;
      const category: Category = new Category(name, limit, +this.currentCategoryId);

      this.updateCategory(form, category);
    }
  }

  onChangeLimit(limit: NgModel) {
    if (limit.control.value < 0) {
      const positiveValue = limit.control.value * -1;
      limit.control.setValue(positiveValue);
    }
  }

  onCategoryChange() {
    const currentCategory = this.categories.find((category: Category) => {
      return category.id === +this.currentCategoryId;
    });
    this.currentCategory = new Category(currentCategory.name, currentCategory.limit);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  private updateCategory(form: NgForm, category: Category) {
    this.subscriptions.push(
      this.categoriesService.updateCategory(category)
        .subscribe((categoryFromResponse: Category) => {
          this.editNewCategory.emit(categoryFromResponse);
          this.addMessage('success', 'Category was edited');
        })
    );
  }

  private addMessage(type, text) {
    this.message = new Message(type, text);

    setTimeout(() => {
      this.message.text = '';
    }, 3000);
  }
}
