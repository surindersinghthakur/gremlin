import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountComponent } from './Components/count/count.component';
import { DsoComponent } from './Components/dso/dso.component';
import { PracticeComponent } from './Components/practice/practice.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
