import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';

/**
 * Generated class for the GroupinfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-groupinfo',
  templateUrl: 'groupinfo.html',
})
export class GroupinfoPage {
  groupmembers;
  groupdetails;
  groupName;
  currentgroupname;
  constructor(public navCtrl: NavController, public navParams: NavParams, public groupservice: GroupsProvider,
              public events: Events) {
                this.groupName = this.navParams.get('groupName');
  }

  ionViewDidLoad() {
    this.groupservice.getownership(this.groupservice.currentgroupname).then((res) => {
      if (res){
        this.groupmembers = this.groupservice.currentgroup;
        this.groupdetails =  this.groupservice.groupdetails;
        this.groupservice.getgroupdetails(this.groupName);
      }
      else {
        this.groupservice.getgroupmembers();
        this.groupservice.getgroupdetails(this.groupName);
      }
      
    })
    this.events.subscribe('gotdetails', () => {
      this.groupdetails = this.groupservice.groupdetails;
    })
    this.events.subscribe('gotmembers', () => {
      this.groupmembers = this.groupservice.currentgroup;
    })
    
    this.currentgroupname=this.groupservice.currentgroupname;
  }

  ionViewWillLeave() {
    this.groupservice.groupdetails = [];
    this.groupdetails=[];
    this.events.unsubscribe('gotmembers');
    this.events.unsubscribe('gotdetails');
  }


}
