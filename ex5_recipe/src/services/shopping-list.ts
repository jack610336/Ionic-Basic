import {Ingredient} from "../model/ingredient";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth";
import 'rxjs/Rx';

@Injectable()
export class ShoppingListServices {

  constructor(private http:HttpClient,
              private authService: AuthService) {
  }
  private ingredients: Ingredient[] =[];

  addItem(name: string , amount: number) {
    this.ingredients.push(new Ingredient(name, amount));
    console.log(this.ingredients);
  }

  addItems(items: Ingredient[]) {
    this.ingredients.push(...items);
  }

  getItems() {
    return this.ingredients.slice();
  }

  removeItem(index: number) {
    this.ingredients.splice(index, 1);
  }

  storeList(token: string) {
    const userId = this.authService.getActiverUser().uid;
    return this.http.put('https://ionicex-6ba12.firebaseio.com/' + userId + '/shopping-list.json?auth='
      + token,this.ingredients);
  }

  fetchList(token: string) {
    const userId = this.authService.getActiverUser().uid;
    return this.http.get('https://ionicex-6ba12.firebaseio.com/' + userId + '/shopping-list.json?auth='
      + token);
  }
}
