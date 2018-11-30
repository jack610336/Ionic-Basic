import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth";
import {AlertController, LoadingController} from "ionic-angular";

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {


  constructor(private authService: AuthService,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {
  }

  onSignin(form: NgForm) {

    const loading = this.loadingCtrl.create({
      content: 'Signing you in....'
    });
    loading.present();

    this.authService.signin(form.value.email, form.value.password)
      .then(
        data => {
          console.log(data);
          loading.dismiss();
        }
      )
      .catch(
        err => {
          console.log(err);
          loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Signup Failed! ',
            message: err.message,
            buttons: ['OK']
          });
          alert.present();
        }
      );
    console.log(form.value);
  }

}
