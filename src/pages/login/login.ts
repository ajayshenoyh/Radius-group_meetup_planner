import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { usercreds } from '../../models/interfaces/usercreds';

import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  credentials = {} as usercreds;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthProvider, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  
   

  signin() {
    this.authservice.login(this.credentials).then((res: any) => {
      if (res)
        this.navCtrl.setRoot('TabsPage');
      else
        {
          let alert = this.alertCtrl.create({
            title: 'Invalid Credentials',
            subTitle: 'Username/Password is incorrect',
            buttons: ['Try again']
          });
          alert.present();
        }
    })
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  passwordreset() {
    this.navCtrl.push('PasswordresetPage');
  }

}
