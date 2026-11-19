import { Routes } from '@angular/router';
import {TimesheetComponent} from '../component/timesheet-component/timesheet-component';

export const routes: Routes = [
  { path: '', redirectTo: 'timesheet', pathMatch: 'full' },
  { path: 'timesheet', component: TimesheetComponent },
];
