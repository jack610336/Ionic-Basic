import {Place} from "../models/place";
import {Location} from "../models/location";

import {Storage} from "@ionic/storage";
import {Injectable} from "@angular/core";

import {File} from "@ionic-native/file";
import {ToastController} from "ionic-angular";


@Injectable()
export class PlacesService {

  private places: Place[] = [];

  constructor(private storage: Storage,private file: File,private toastCtrl: ToastController) {
  }

  addPlace(title: string,
           description: string,
           location: Location,
           imgUrl: string) {
    const place = new Place(title, description, location, imgUrl);
    this.places.push(place);
    console.log(place);
    this.storage.set('places', this.places)
      .then()
      .catch(
        err => {
          this.places.splice(this.places.indexOf(place), 1);
        }
      );
  }


  loadPlaces() {
    return this.places.slice();
  }


  fetchPlaces() {
    return this.storage.get('places')
      .then(
        (places: Place[]) => {
          this.places = places != null ? places : [];
          return this.places;
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      );
  }
  deletePlace(index: number) {
    const place = this.places[index];
    this.places.splice(index, 1);
    this.storage.set('places', this.places)
      .then(
        () => {
          this.removeFile(place);
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      );
  }

  private removeFile(place: Place) {
    const currentName = place.imgUrl.replace(/^.*[\\\/]/, '');
    this.file.removeFile(this.file.dataDirectory, currentName)
      .then(
        () => {
          console.log('Great');
        }
      )
      .catch(
        err => {
          console.log(err);
          const toast = this.toastCtrl.create({
            message: 'Error while removing File',
            duration: 2500
          });
          toast.present();
          this.addPlace(place.title,place.description,place.location,place.imgUrl);
        }
      );
  }

}
