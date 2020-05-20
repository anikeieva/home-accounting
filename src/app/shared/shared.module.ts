import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentPipe } from './pipes/moment.pipe';
import { SearchFilterPipe } from './pipes/search-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    MomentPipe,
    SearchFilterPipe
  ],
  declarations: [MomentPipe, SearchFilterPipe]
})
export class SharedModule { }
