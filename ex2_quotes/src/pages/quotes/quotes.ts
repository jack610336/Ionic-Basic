import {Component, OnInit} from '@angular/core';
import {AlertController, NavParams} from "ionic-angular";
import {Quote} from "../../data/quote.interface";
import {QuotesServices} from "../../services/quotes";

@Component({
  selector: 'page-quotes',
  templateUrl: 'quotes.html',
})
export class QuotesPage implements OnInit {

  quoteGroup: { category: string, quotes: Quote[], icon: string };

  constructor(private navParams: NavParams,
              private alertCtrl: AlertController,
              private quotesService: QuotesServices) {

  }

  ngOnInit(): void {
    this.quoteGroup = this.navParams.data;
  }

  // ionViewDidLoad() {
  //   this.quoteGroup = this.navParams.data;

  //  Add elvis operator (?) im template to use this approach.
  //  Cause ionViewDidLoad is load after the template
  //  like this "{{quoteGroup?.category}}"
  //  It will load category when quoteGroup created !
  // }

  onAddToFavorite(selectedQuote: Quote) {
    const alert = this.alertCtrl.create({
      title: 'Add Quote',
      subTitle: 'Are you sure? ',
      message: 'Are you sure you want to add the quote?',
      buttons: [
        {

          text: 'Yes , go ahead',
          handler: () => {
            this.quotesService.addQuoteToFavorites(selectedQuote);
          },
        },
        {
          text: 'No!',
          role: 'cancel',
          //if add role, it's mean when the alert dismiss or click the background, it would do the handler,
          //if we did not add role, it will do the handler when the button click !
          handler: () =>{
           console.log('No');
         }
        }]
    });
    alert.present();
  }

  onRemoveFromFavorite(quote: Quote) {

    this.quotesService.removeQuoteFromFavorite(quote);
  }

  isFavorite(quote: Quote) {
    return this.quotesService.isQuoteFavorite(quote);
  }

}
