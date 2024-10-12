import { UiManager } from "./UiManager";

UiManager.getInstance();

;(async function(){
  await sleep(1000);
  await UiManager.getInstance().tutorial();
})();