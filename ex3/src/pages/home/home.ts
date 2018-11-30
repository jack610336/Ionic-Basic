import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  countOfTap = 0;
  countOfPress = 0;


  constructor(public navCtrl: NavController) {}


  onWin() {
    if (this.countOfTap == 2 && this.countOfPress == 4) {
      return 'You Won The Game ! ';
    } else {
      return 'tap twice , press four times ';
    }
  }
  onTap() {
    this.countOfTap++;
  }

  onPress() {
    this.countOfPress++
  }

  resetFun(resetType: string) {

    switch (resetType) {
      case 'all':
        this.countOfTap = 0;
        this.countOfPress = 0;
        break;
      case 'tap':
        this.countOfTap = 0;
        break;
      case 'press':
        this.countOfPress = 0;
        break;
    }
  }

}
