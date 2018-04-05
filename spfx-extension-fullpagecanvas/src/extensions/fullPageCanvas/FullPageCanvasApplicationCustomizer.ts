import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';
import * as strings from 'FullPageCanvasApplicationCustomizerStrings';

const LOG_SOURCE: string = 'FullPageCanvasApplicationCustomizer';

export default class FullPageCanvasApplicationCustomizer
  extends BaseApplicationCustomizer<{}> {

  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Hiding the header of the page');

    // Added to handle possible changes on the existence of placeholders
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

    // Hide header
    this._renderPlaceHolders();

    return Promise.resolve();
  }
  
  private _renderPlaceHolders = () =>  {
    // Only run on front page
    if (!this.context.pageContext.legacyPageContext.isWebWelcomePage) {
      return;
    }

    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top);
    }
  
    if (this._topPlaceholder.domElement) {
      this._topPlaceholder.domElement.innerHTML = `
        <div>
          <style>
            .ms-compositeHeader { display: none!important; }
          </style>
        </div>`;
    }
  }
}
