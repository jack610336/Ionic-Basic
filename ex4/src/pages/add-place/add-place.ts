import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { Entry, File, FileError } from "@ionic-native/file";
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { Geolocation } from "@ionic-native/geolocation";
import { LoadingController, ModalController, ToastController } from "ionic-angular";
import { Location } from "../../models/location";
import { PlacesService } from "../../services/places";
import { SetLocationPage } from "../set-location/set-location";

@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {


  location: Location = {
    lat: 43.656283540226106,
    lng: -79.38064098358154
  };
  locationIsSet = false;
  imgUrl = '';
  fileName = 'testPhoto';

  constructor(private  modalCtrl: ModalController,
              private geoloc: Geolocation,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private camera: Camera,
              private placesService: PlacesService,
              private file: File,
              private transfer: FileTransfer) {


  }
  onSubmit(form: NgForm) {
    this.placesService
      .addPlace(form.value.title, form.value.description, this.location, this.imgUrl);
    form.reset();
    this.location= {
      lat: 43.656283540226106,
      lng: -79.38064098358154
    };
    this.imgUrl = '';
    this.locationIsSet = false;
  }

  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage,
      {location: this.location, isSet: this.locationIsSet});
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data) {
          this.location = data.location;
          this.locationIsSet = true;
        }
      }
    );
  }


  onLocate() {
    const loader = this.loadingCtrl.create({
      content: 'Getting your Location....'
    });
    loader.present();
    console.log('in');
    this.geoloc.getCurrentPosition()
      .then(

        location => {
          loader.dismiss();
          console.log('in2');
          this.location.lat = location.coords.latitude;
          this.location.lng = location.coords.longitude;
          this.locationIsSet = true;

        }
      )
      .catch(
        error => {
          loader.dismiss();
          const toast = this.toastCtrl.create({
            message: 'can not get your location! ',
            duration: 2500
          });
          toast.present();
          console.log('noin');
          console.log(error);
        }
      );
  }



  createFileName(file) {
    let ext = file.substr(file.lastIndexOf(".") + 1);
    // let ext2 = ext.substr(ext("?"));
    console.log(ext);
    // console.log(ext2);

    var d = new Date(),
      n = d.getTime(),
      newFileName = n +"." + ext;
    return newFileName;
  }


  uploadFile(fileName) {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    // loader.present();


    // let ext = fileName.substr(fileName.lastIndexOf(".") + 1);
    console.log(fileName);
    var realFileName = this.createFileName(fileName);
    let options: FileUploadOptions = {
      fileKey: 'upfile1',
      fileName: realFileName,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      headers: {managerkey:'eyJhbGciOiJIUzUxMiJ9.eyJhTm8iOjIwNDk2NywiYUlkIjoiQUEwODAxMTA0IiwiZXhwIjoxNTM4MDEyNDgwfQ.bLD6XsPR09CpuhHZY8PPInyT_nh-cTgmDLlKeqn9_O4S0_DRjP38AeyDB9xpN3sE204jq-k6u1eYquT03a6M5A'}
    }
    console.log(options);
    const fileTransfer: FileTransferObject = this.transfer.create();
    console.log(fileTransfer);

    fileTransfer.upload(this.imgUrl, 'http://dev.partner-portal.corpnet.asus:12105/api/ecom/image?type=U', options)
      .then((data) => {
      console.log(data+" Uploaded Successfully");
      console.log(data);
      console.log(JSON.parse(data.response));
      console.log(this.fileName);
      // loader.dismiss();
    }, (err) => {
      console.log(err);
      // loader.dismiss();
    });
  }

  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imgUrl = imageData;
      if(this.imgUrl){
        this.uploadFile(this.imgUrl);
      }
    }, (err) => {
      console.log(err);
    });
  }

  onTakePhoto() {
    this.camera.getPicture({
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    })
      .then(
        imageData =>{
          console.log(imageData);
          const currentName = imageData.replace(/^.*[\\\/]/, '');
          const path = imageData.replace(/[^\/]*$/, '');
          const newFileName = new Date().getUTCMilliseconds() + '.png';
          console.log(newFileName);
          this.fileName = newFileName;
          this.file.moveFile(path,currentName,this.file.dataDirectory,newFileName)
            .then(
              (data: Entry) =>{
                this.imgUrl = data.nativeURL;
                this.camera.cleanup();
                // this.file.removeFile(path, currentName);
              }
            )
            .catch(
              (err: FileError) =>{
                this.imgUrl = '';
                const toast = this.toastCtrl.create({
                  message: 'cound not save the image. Please try again',
                  duration: 2500
                });
                toast.present();
                this.camera.cleanup();

              }
            );
          this.imgUrl = imageData;
          if(this.imgUrl){
            this.uploadFile(this.imgUrl);
          }

        }
      )
      .catch(
        err =>{
          console.log(err)
        }
      )
  }
}
