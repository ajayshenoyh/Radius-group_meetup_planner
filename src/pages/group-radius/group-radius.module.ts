import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupRadiusPage } from './group-radius';

@NgModule({
  declarations: [
    GroupRadiusPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupRadiusPage),
  ],
  exports: [
    GroupRadiusPage
  ]
})
export class GroupRadiusPageModule {}
