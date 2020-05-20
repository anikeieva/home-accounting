import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentPipe } from './pipes/moment.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
    exports: [
        ReactiveFormsModule,
        FormsModule,
        MomentPipe
    ],
  declarations: [MomentPipe]
})
export class SharedModule { }
