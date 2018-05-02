import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupownerLocationPage } from './groupowner-location';

@NgModule({
  declarations: [
    GroupownerLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupownerLocationPage),
  ],
  exports: [
    GroupownerLocationPage
  ]
})
export class GroupownerLocationPageModule {}
