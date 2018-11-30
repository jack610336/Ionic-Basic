import {Component, OnInit} from '@angular/core';
import {AlertController, NavController, NavParams} from "ionic-angular";
import {Recipe} from "../../model/recipe";
import {EditRecipePage} from "../edit-recipe/edit-recipe";
import {ShoppingListServices} from "../../services/shopping-list";
import {RecipesService} from "../../services/recipes";

@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
})
export class RecipePage implements OnInit{

  recipe:Recipe;
  index: number;
  constructor(public navCtrl: NavController,
              public navParm: NavParams,
              private slService: ShoppingListServices,
              private recipeService: RecipesService,
              private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.recipe = this.navParm.get('recipe');
    this.index = this.navParm.get('index');
  }

  onEditRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'Edit',recipe:this.recipe, index: this.index});
  }


  onAddIngredients() {
    this.slService.addItems(this.recipe.ingredients);
  }

  onDeleteRecipe() {

      const confirm = this.alertCtrl.create({
        title: 'Delete Alert',
        message: 'Do you really want to delete this recipe?',
        buttons: [
          {
            text: 'No'
          },
          {
            text: 'Yes',
            handler: () => {
              this.recipeService.removeRecipe(this.index);
              this.navCtrl.popToRoot();
            }
          }
        ]
      });
      confirm.present();





  }
}
