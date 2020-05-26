import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentPipe } from './pipes/moment.pipe';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { LoaderComponent } from './components/loader/loader.component';
import { AlertMessageComponent } from './components/alert-message/alert-message.component';
import { CommonComponent } from './components/message/common.component';

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
    LoaderComponent,
    AlertMessageComponent
  ],
  declarations: [
    MomentPipe,
    SearchFilterPipe,
    LoaderComponent,
    AlertMessageComponent,
    CommonComponent
  ]
})
export class SharedModule { }
