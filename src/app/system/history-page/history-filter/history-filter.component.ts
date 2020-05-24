import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FormField } from '../../../shared/models/formField.model';
import { Category } from '../../../shared/models/category';
import { HistoryFilterData } from '../../../shared/models/historyFilterData.model';

@Component({
  selector: 'acc-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements OnInit {
  historyFilterData: HistoryFilterData;

  constructor(
    public dialogRef: MatDialogRef<HistoryFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: Category[], historyFilterData: HistoryFilterData }
  ) { }

  ngOnInit(): void {
    this.historyFilterData = new HistoryFilterData();

    if (this.data && this.data.historyFilterData) {
      Object.keys(this.data.historyFilterData).forEach((key: string) => {
        if (Array.isArray(this.data.historyFilterData[key])) {
          this.data.historyFilterData[key].forEach((item) => {
            const newItem = Object.assign({}, item);
            this.historyFilterData[key].push(newItem);
          });
        }
      });

      // this.initsSelectedPeriod();
    }
  }

  closeModal(historyFilterData: HistoryFilterData = null) {
    this.dialogRef.close(historyFilterData);
  }

  selectEventType(target, eventType: FormField) {
    const { checked, value } = target;
    eventType.checked = checked;

    if (eventType) {
      const currentItem: FormField = this.historyFilterData.eventTypes.find((field: FormField) => {
        return field.type === value;
      });

      if (!currentItem) {
        this.historyFilterData.eventTypes.push(eventType);
      }
    }
  }

  selectCategory(target, category?: Category) {
    const { checked } = target;
    category.checked = checked;
  }

  applyFilter() {
    // this.selectPeriod();

    if (!this.historyFilterData.eventTypes.length || !this.historyFilterData.categories.length) {
      console.log('Fill required fields');
      return;
    }

    this.historyFilterData.isEnableFilter = true;
    this.closeModal(this.historyFilterData);
  }

  selectPeriod(target, period: FormField) {
    const { checked } = target;
    period.checked = checked;

    if (checked) {
      this.historyFilterData.period.forEach((itemPeriod: FormField) => {
        if (itemPeriod.type !== period.type) {
          itemPeriod.checked = false;
        }
      });
    }
  }
}
