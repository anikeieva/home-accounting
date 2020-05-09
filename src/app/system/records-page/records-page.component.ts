import { Component, OnInit } from '@angular/core';
import {Category} from '../../shared/models/category';

@Component({
  selector: 'acc-records-page',
  templateUrl: './records-page.component.html',
  styleUrls: ['./records-page.component.scss']
})
export class RecordsPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onAddCategory(category: Category) {
    console.log(category);
  }

}
