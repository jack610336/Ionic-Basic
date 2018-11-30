import {Component, OnInit} from '@angular/core';
import {Quote} from "../../data/quote.interface";
import {QuotesServices} from "../../services/quotes";
import {ModalController} from "ionic-angular";
import {QuotePage} from "../quote/quote";
import {SettingService} from "../../services/setting";


@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage implements OnInit{

  quotes: Quote[];

  constructor(private quotesService: QuotesServices,
              private modalCtrl: ModalController,
              private settingServ: SettingService) {

  }

  ngOnInit(): void {

  }

  ionViewWillEnter() {
    this.quotes = this.quotesService.getFavoriteQuotes();
  }


  onRemoveFromFavorites(quote: Quote) {
    this.quotesService.removeQuoteFromFavorite(quote);
    // this.quotes = this.quotesService.getFavoriteQuotes();
    const position = this.quotes.findIndex((quoteEl: Quote) => {
      return quoteEl.id == quote.id;
    });
    this.quotes.splice(position, 1);
  }

  onViewQuote(quote: Quote) {
    const modal = this.modalCtrl.create(QuotePage,quote);
    modal.present();
    modal.onDidDismiss((remove: boolean) => {

      if (remove) {
        this.onRemoveFromFavorites(quote);
      }
    });
  }


  getBackGround() {
    return this.settingServ.isToggleChecked() ? 'altQuoteBackground' : 'quoteBackground';
  }

}
