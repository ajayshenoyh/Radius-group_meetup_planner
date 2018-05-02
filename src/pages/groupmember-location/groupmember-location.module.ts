import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupmemberLocationPage } from './groupmember-location';

@NgModule({
  declarations: [
    GroupmemberLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupmemberLocationPage),
  ],
  exports: [
    GroupmemberLocationPage
  ]
})
export class GroupmemberLocationPageModule {}
