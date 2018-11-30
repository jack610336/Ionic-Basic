import {Component, EventEmitter, Output} from "@angular/core";


@Component({

  selector: 'app-reset',
  template: `
    <ion-row text-center>
      <ion-col col-3>
        <button ion-button small block (click)="reset('all')" color="danger">Reset All</button>
      </ion-col >
      <ion-col col-4>
        <button ion-button small block (click)="reset('tap')" color="danger">Reset "Taps"</button>
      </ion-col>
      <ion-col col-5>
        <button ion-button small block (click)="reset('press')" color="danger">Reset "Presses"</button>
      </ion-col>
    </ion-row>
  `
})
export class ResetComponent {

  @Output() resetClick = new EventEmitter<string>();

  reset(type: string) {
    this.resetClick.emit(type);
  }
}
