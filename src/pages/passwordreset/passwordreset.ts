import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
/**
 * Generated class for the PasswordresetPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-passwordreset',
  templateUrl: 'passwordreset.html',
})
export class PasswordresetPage {
  email: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public userservice: UserProvider, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
   // console.log('ionViewDidLoad PasswordresetPage');
  }

  reset() {
  
    this.userservice.passwordreset(this.email).then((res: any) => {
      if (res) {
        let alert = this.alertCtrl.create({
          title: 'Email Sent',
          subTitle: 'Please follow the instructions in the email to reset your password',
          buttons: ['Ok']
        });
        alert.present();
      }
    else {
      let alert = this.alertCtrl.create({
        title: 'Failed',
        subTitle: 'Invalid email address',
        buttons: ['Try again']
      });
      alert.present();
    }
  })
  }

  goback() {
    this.navCtrl.setRoot('LoginPage');
  }

}
