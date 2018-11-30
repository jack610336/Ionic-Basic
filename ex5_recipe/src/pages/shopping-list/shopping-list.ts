import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {ShoppingListServices} from "../../services/shopping-list";
import {Ingredient} from "../../model/ingredient";
import {AlertController, LoadingController, PopoverController} from "ionic-angular";
import {DatabaseOptionsPage} from "../database-options/database-options";
import {AuthService} from "../../services/auth";

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {


  listItems: Ingredient[];

  constructor(private slService: ShoppingListServices,
              private popOverCtrl: PopoverController,
              private authService: AuthService,
              private loadingCtrl:LoadingController,
              private alertCtrl: AlertController) {
    console.log("constructor");
  }

  ionViewWillEnter() {
    this.loadList('willEnter');
    console.log("willEnter");

  }

  onAddItem(form: NgForm) {
    this.slService.addItem(form.value.ingredientName, form.value.amount);
    form.reset();
    this.loadList('additem');
    console.log("AddItem");
    this.upLoadingData();
  }


  onRemoveItem(itemIndex:number) {
    this.slService.removeItem(itemIndex);
    this.loadList('RemoveItem');
    this.upLoadingData();
  }

  private loadList(test: string) {
    this.listItems = this.slService.getItems();
    console.log("LoadList = " + test);

  }



  moveFocusF(event,nextElement) {

    if (event.key === "Enter") {
      nextElement.setFocus();
    }
  }


  upLoadingData() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait for uploading...'
    });
    loading.present();
    this.authService.getActiverUser().getIdToken()
      .then(
        (token: string) => {
          this.slService.storeList(token)
            .subscribe(
              data => {
                console.log(data + 'success!');
                loading.dismiss();
              },
              error1 => {
                loading.dismiss();
                console.log('Failed'+ error1);
                this.handleErrorMsg(error1.message);
              }
            );
        }
      );
  }

  fetchData() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait for downloading...'
    });
    loading.present();
    this.authService.getActiverUser().getIdToken()
      .then(
        (token: string) => {
          this.slService.fetchList(token)
            .subscribe(
              (list: Ingredient[]) => {
                console.log(list + 'success!');
                loading.dismiss();
                if (list) {
                  for (let i =0;i<list.length;i++){
                    this.slService.addItem(list[i].name,list[i].amount);
                  }
                  this.listItems = list;
                } else {
                  this.listItems = [];
                }
              },
              error1 =>{
                console.log('Failed'+error1);
                loading.dismiss();
                this.handleErrorMsg(error1.message);
              }
            );
        }
      );
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popOverCtrl.create(DatabaseOptionsPage);
    popover.present({ev: event});
    popover.onDidDismiss(
      data => {

        if (data != null) {
          if (data.action == 'load') {
            this.fetchData();
          } else {
            this.upLoadingData();
          }
        }
      }
    )
  }

  private handleErrorMsg(errMsg: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errMsg,
      buttons: ['OK']
    });
    alert.present();
  }
}
