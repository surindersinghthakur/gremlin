import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountComponent } from './Components/count/count.component';
import { DsoComponent } from './Components/dso/dso.component';
import { PracticeComponent } from './Components/practice/practice.component';
import { PopupLocationComponent } from './Components/popup-location/popup-location.component';
import { PopupDsoComponent } from './Components/popup-dso/popup-dso.component';

const routes: Routes = [
  {
    path: 'count',
    component: CountComponent
  },
  {
    path: 'dso',
    component: DsoComponent
  },
  {
    path: 'practice',
    component: PracticeComponent
  },
  {
    path: 'popupDso',
    component: PopupDsoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
