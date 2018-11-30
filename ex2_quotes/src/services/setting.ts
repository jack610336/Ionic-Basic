

export class SettingService{





  private altBackground = false;

  setBackground(isAlt: boolean) {
    this.altBackground = isAlt;

  }
  isToggleChecked() {

    return this.altBackground;
  }


}

