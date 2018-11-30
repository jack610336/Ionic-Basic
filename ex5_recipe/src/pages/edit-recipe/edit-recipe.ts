import {Component, OnInit} from '@angular/core';
import {ActionSheetController, AlertController, NavController, NavParams, ToastController} from "ionic-angular";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipesService} from "../../services/recipes";
import {Recipe} from "../../model/recipe";

@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit{

  mode = 'New';
  selectOption = ['Easy', 'Medium', 'Hard'];
  recipe: Recipe;
  index: number;
  recipeForm: FormGroup;

  constructor(private navParams: NavParams,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private recipesService: RecipesService,
              private navCtrl: NavController) {
  }

  ngOnInit(): void {
    this.mode = this.navParams.get('mode');
    if (this.mode == 'Edit') {
      this.recipe = this.navParams.get('recipe');
      this.index = this.navParams.get('index');
    }
    this.initialzeForm();
  }

  moveFocus(event,nextElement) {

    if (event.key === "Enter") {
      nextElement.setFocus();
    }
  }

  private initialzeForm() {
    let title = null;
    let description = null;
    let difficulty = 'Medium';
    let ingredients = [];

    if (this.mode == 'Edit') {
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      for (let ingredient of this.recipe.ingredients) {
        ingredients.push(new FormControl(ingredient.name, Validators.required));
      }
    }

    this.recipeForm = new FormGroup({
      'title':new FormControl(title,Validators.required),
      'description': new FormControl(description,Validators.required),
      'difficulty': new FormControl(difficulty,Validators.required),
      'ingredients': new FormArray(ingredients)
    });
  }


  onSubmit() {
    console.log(this.recipeForm);

    const value = this.recipeForm.value;
    let ingredients = [];
    if (value.ingredients.length > 0) {
      ingredients = value.ingredients.map(name => {
        return { name: name , amount: 1}
      });
    }

    if (this.mode == 'Edit') {
      this.recipesService.updateRecipe(this.index, value.title, value.description, value.difficulty, ingredients);
    } else {
      this.recipesService.addRecipe(value.title,value.description,value.difficulty,ingredients);
    }

    this.recipeForm.reset();
    this.navCtrl.popToRoot();
  }


  onMangeIngredients() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do? ',
      buttons: [
        {
          text: 'Add Ingredient',
          handler: () => {
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: 'Remove All Ingredients',
          role: 'destructive',
          handler: () => {
            const fArray: FormArray = <FormArray>this.recipeForm.get('ingredients');
            const len = fArray.length;
            if (len > 0) {
              for (let i = len -1; i>=0;i--){
                fArray.removeAt(i);
              }
              const toast = this.toastCtrl.create({
                message: 'All Ingredients were deleted!',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
            }
          }
        },
        {
          text:'Cancel',
          role:'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  private createNewIngredientAlert() {
    return this.alertCtrl.create({
      title:'Add Ingredient',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text:'Cancel',
          role:'cancel'
        },
        {
          text:'Add',
          handler: data=>{
            if (data.name.trim() == '' || data.name == null) {
              const toast = this.toastCtrl.create({
                message: 'Please enter a valid value',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
                return;
            }
            (<FormArray>this.recipeForm.get('ingredients'))
              .push(new FormControl(data.name, Validators.required));
                const toast = this.toastCtrl.create({
                  message: 'Add!!!! ',
                  duration: 3000,
                  position: 'bottom'
                });
                toast.present();
          }
        }
      ]
    });
  }

}
