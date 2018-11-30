import { Component } from '@angular/core';
import {Toggle} from "ionic-angular";
import {SettingService} from "../../services/setting";

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {


  constructor(private settingServ: SettingService) {
  }

  onToggle(toggle: Toggle) {
    this.settingServ.setBackground(toggle.checked);
  }

  checkAltBackground() {
    return this.settingServ.isToggleChecked();
  }


}
