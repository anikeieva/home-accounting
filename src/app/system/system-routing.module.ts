import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SystemComponent } from './system.component';
import { BillPageComponent } from './bill-page/bill-page.component';
import { HistoryPageComponent } from './history-page/history-page.component';
import { PlanningPageComponent } from './planning-page/planning-page.component';
import { RecordsPageComponent } from './records-page/records-page.component';
import { HistoryDetailsComponent } from './history-page/history-details/history-details.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  { path: '', component: SystemComponent, canActivate: [AuthGuard], children: [
      { path: '', redirectTo: 'bill', pathMatch: 'full' },
      { path: 'bill', component: BillPageComponent },
      { path: 'history', component: HistoryPageComponent },
      { path: 'planning', component: PlanningPageComponent },
      { path: 'records', component: RecordsPageComponent },
      { path: 'history/:id', component: HistoryDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
