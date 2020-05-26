import { Component, OnInit } from '@angular/core';
import { Category } from '../../shared/models/category';
import { CategoriesService } from '../../shared/services/categories.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'acc-records-page',
  templateUrl: './records-page.component.html',
  styleUrls: ['./records-page.component.scss']
})
export class RecordsPageComponent implements OnInit {
  categories: Category[] = [];
  isLoaded = false;

  constructor(
    private categoriesService: CategoriesService,
    private title: Title
  ) {
    this.title.setTitle('Records page');
  }

  ngOnInit(): void {
    this.categoriesService.getCategories()
      .subscribe((categories: Category[]) => {
        this.categories = categories;
        this.isLoaded = true;
      });
  }

  onAddCategory(category: Category) {
    this.categories.push(category);
  }

  editNewCategory(category: Category) {
    const categoryIndex: number = this.categories.findIndex((itemCategory: Category) => {
      return itemCategory.id === category.id;
    });

    if (categoryIndex) {
      this.categories[categoryIndex] = category;
    }
  }
}
