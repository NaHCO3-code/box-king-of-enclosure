export class KUiManager {
  currentScreen: UiScreen[] = [];
  screens: UiScreen[] = [];
  constructor(){
    this.screens.push((ui as UiScreen));
    this.currentScreen.push((ui as UiScreen));
  }
}