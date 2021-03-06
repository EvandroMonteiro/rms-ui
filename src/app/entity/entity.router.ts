import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { NewComponent } from './new/new.component';
import { ShowComponent } from './show/show.component';

const routes: Routes = [
  {
    path: 'index',
    component: IndexComponent
  },
  {
    path: 'show/:id',
    component: ShowComponent
  },
  {
    path: 'new',
    component: NewComponent
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class EntityRouter { }
