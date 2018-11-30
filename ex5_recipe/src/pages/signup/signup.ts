import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth";
import {AlertController, LoadingController} from "ionic-angular";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {


  constructor(private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {

  }

  onSignup(form: NgForm) {

    const loading = this.loadingCtrl.create({
      content: 'Signing you up....'
    });
    loading.present();


    this.authService.signup(form.value.email, form.value.password)
      .then(data => {
        console.log(data);
        loading.dismiss();
      })
      .catch(error =>{
        console.log(error);
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Signup Failed! ',
          message: error.message,
          buttons: ['OK']
        });
        alert.present();
      });
    console.log(form.value);
  }

}
