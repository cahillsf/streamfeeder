import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostModalPageRoutingModule } from './post-modal-routing.module';

import { PostModalPage } from './post-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostModalPageRoutingModule
  ],
  declarations: [PostModalPage]
})
export class PostModalPageModule {}
