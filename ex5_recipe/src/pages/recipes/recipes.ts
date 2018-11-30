import { Component } from '@angular/core';
import {RecipePage} from "../recipe/recipe";
import {AlertController, LoadingController, NavController, PopoverController} from "ionic-angular";
import {EditRecipePage} from "../edit-recipe/edit-recipe";
import {Recipe} from "../../model/recipe";
import {RecipesService} from "../../services/recipes";
import {DatabaseOptionsPage} from "../database-options/database-options";
import {AuthService} from "../../services/auth";
import {ShoppingListServices} from "../../services/shopping-list";

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {

  recipes: Recipe[];


  editRecipePage = EditRecipePage;
  recipePage = RecipePage;
  constructor(private navCtrl: NavController,
              private recipeService: RecipesService,
              private popOverCtrl: PopoverController,
              private authService: AuthService,
              private loadingCtrl:LoadingController,
              private alertCtrl: AlertController,
              private slService: ShoppingListServices) {

  }
  onNewRecipe() {
    this.navCtrl.push(this.editRecipePage,{mode: 'New'});
  }

  ionViewWillEnter() {
    this.recipes = this.recipeService.getRecipes();
    this.upLoadingData();

  }

  ionViewDidEnter() {
    this.fetchData();
  }



  onLoadRecipe(recipe:Recipe,index: number) {
    this.navCtrl.push(this.recipePage,{recipe: recipe,index: index});
  }

  upLoadingData() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait for uploading...'
    });
    loading.present();
    this.authService.getActiverUser().getIdToken()
      .then(
        (token: string) => {
          this.recipeService.storeList(token)
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
          this.recipeService.fetchList(token)
            .subscribe(
              (list: Recipe[]) => {
                console.log(list + 'success!');
                loading.dismiss();
                if (list) {
                  this.recipes = list;
                } else {
                  this.recipes = [];
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
