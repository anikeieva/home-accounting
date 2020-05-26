import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';

import { Category } from '../../../shared/models/category';
import { CategoriesService } from '../../../shared/services/categories.service';
import { Subscription } from 'rxjs';
import { CommonComponent } from '../../../shared/components/message/common.component';

@Component({
  selector: 'acc-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent extends CommonComponent implements OnInit {
  subscriptions: Subscription[] = [];

  @Output() addNewCategory = new EventEmitter<Category>();

  constructor(
    private categoriesService: CategoriesService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (form) {
      const { name, limit } = form.value;
      const category: Category = new Category(name, limit);

      this.addCategory(form, category);
    }
  }

  onChangeLimit(limit: NgModel) {
    if (limit.control.value < 0) {
      const positiveValue = limit.control.value * -1;
      limit.control.setValue(positiveValue);
    }
  }

  private addCategory(form: NgForm, category: Category) {
    this.subscriptions.push(
      this.categoriesService.addCategory(category)
        .subscribe((categoryFromResponse: Category) => {
          form.reset();
          form.form.patchValue({limit: 1});
          this.addNewCategory.emit(categoryFromResponse);
        })
    );
  }
}
