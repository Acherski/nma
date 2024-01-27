import { Injectable } from '@angular/core';
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { NotTranslatedService } from './not-translated-service.service';

@Injectable()
export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): string {
    this.nts.notTranslated(params.key);
    return '[MISSING]' + params.key;
  }

  constructor(private nts: NotTranslatedService) {}
}
