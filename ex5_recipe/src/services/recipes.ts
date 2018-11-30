import {Recipe} from "../model/recipe";
import {Ingredient} from "../model/ingredient";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth";
import 'rxjs/Rx';

@Injectable()
export class RecipesService {

  constructor(private http:HttpClient,
              private authServece:AuthService) {
  }
  private recipes: Recipe[] = [];

  addRecipe(title: string ,
            description: string,
            difficulty: string,
            ingredients: Ingredient[]) {
    this.recipes.push(new Recipe(title,description,difficulty,ingredients))
    console.log(this.recipes);
  }


  getRecipes() {
    return this.recipes.slice();
  }

  updateRecipe(index: number,
               title: string ,
               description: string,
               difficulty: string ,
               ingredients: Ingredient[]) {
    this.recipes[index] = new Recipe(title, description, difficulty, ingredients);
  }


  removeRecipe(index: number) {
    this.recipes.splice(index, 1);
  }


  storeList(token: string) {
    const userId = this.authServece.getActiverUser().uid;
    return this.http.put('https://ionicex-6ba12.firebaseio.com/' + userId + '/recipes.json?auth='
      + token, this.recipes);
  }

  fetchList(token: string) {
    const userId = this.authServece.getActiverUser().uid;
    return this.http.get('https://ionicex-6ba12.firebaseio.com/' + userId + '/recipes.json?auth='
      + token)
      .do((recipes: Recipe[]) => {
        if (recipes) {
          for (let item of recipes) {
            if (!item.hasOwnProperty('ingredients')) {
              item.ingredients = [];
            }
          }
          this.recipes = recipes;
        }
        else {
          this.recipes = [];
        }
      });
  }

}
