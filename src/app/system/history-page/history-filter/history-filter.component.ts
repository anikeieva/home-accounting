import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FormField } from '../../../shared/models/formField.model';
import { Category } from '../../../shared/models/category';

@Component({
  selector: 'acc-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements OnInit {
  periodsList: FormField[] = [
    { type: 'd', label: 'Day' },
    { type: 'w', label: 'Week' },
    { type: 'M', label: 'Month' }
  ];
  eventTypes: FormField[] = [
    { type: 'outcome', label: 'Outcome' },
    { type: 'income', label: 'Income' }
  ];

  selectedPeriod = 'd';
  selectedEventType = 'outcome';

  constructor(
    public dialogRef: MatDialogRef<HistoryFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: Category[] }
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    console.log(this.data.categories);
  }

  closeModal() {
    this.dialogRef.close();
  }

  selectEventType(target: EventTarget) {
    console.log(target);
  }

  selectCategory(target: EventTarget) {
    console.log(target);
  }
}
