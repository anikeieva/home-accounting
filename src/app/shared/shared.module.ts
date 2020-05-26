import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentPipe } from './pipes/moment.pipe';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { LoaderComponent } from './components/loader/loader.component';

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
    SearchFilterPipe,
    LoaderComponent
  ],
  declarations: [
    MomentPipe,
    SearchFilterPipe,
    LoaderComponent
  ]
})
export class SharedModule { }
