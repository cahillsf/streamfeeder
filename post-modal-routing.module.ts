import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostModalPage } from './post-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PostModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostModalPageRoutingModule {}
