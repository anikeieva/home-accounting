import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FormField } from '../../../shared/models/formField.model';
import { Category } from '../../../shared/models/category';
import { HistoryFilterData } from '../../../shared/models/historyFilterData.model';
import * as moment from 'moment';
import StartOf = moment.unitOfTime.StartOf;

@Component({
  selector: 'acc-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements OnInit {
  selectedPeriod: StartOf | string = '';

  constructor(
    public dialogRef: MatDialogRef<HistoryFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: Category[], historyFilterData: HistoryFilterData }
  ) { }

  ngOnInit(): void {
    console.log(this.data.historyFilterData);
  }

  closeModal(historyFilterData: HistoryFilterData = null) {
    this.dialogRef.close(historyFilterData);
  }

  selectEventType(target, eventType: FormField) {
    const { checked, value } = target;
    eventType.checked = checked;

    if (eventType) {
      const currentItem: FormField = this.data.historyFilterData.eventTypes.find((field: FormField) => {
        return field.type === value;
      });

      if (!currentItem) {
        this.data.historyFilterData.eventTypes.push(eventType);
      }
    }
  }

  selectCategory(target, category?: Category) {
    const { checked } = target;
    category.checked = checked;
  }

  applyFilter() {
    this.selectPeriod();

    if (!this.data.historyFilterData.eventTypes.length || !this.data.historyFilterData.categories.length) {
      console.log('Fill required fields');
      return;
    }

    this.data.historyFilterData.isEnableFilter = true;
    this.closeModal(this.data.historyFilterData);
  }

  private selectPeriod() {
    this.data.historyFilterData.period.forEach((period: FormField) => {
      if (period.type === this.selectedPeriod) {
        period.checked = true;
      }
    });
  }
}
