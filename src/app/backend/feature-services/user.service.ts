import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebsocketService } from '../websocket.service';
import { RequestEnum } from '../enums/requests.enum';
import { mapResponseToStringArray } from '../../shared/utils/functions/map-backend-res-to-array.util';

@Injectable()
export class UserService extends WebsocketService {
  public loadUserList(): Observable<string> {
    return this.sendMessage(`R|${this.getAndSetIndex()}|${RequestEnum.LOAD_USERS}`);
  }

  public removeUser(userName: string): Observable<string> {
    return this.sendMessage(`R|${this.getAndSetIndex()}|${RequestEnum.REMOVE_USER}|${userName}`);
  }

  public loadUserAttributeKeys(userName: string): Observable<string> {
    return this.sendMessage(`R|${this.getAndSetIndex()}|${RequestEnum.LOAD_USER_ATTR_KEYS}|${userName}`);
  }

  public loadUserAttributeValues(userName: string, attributes: string): Observable<string> {
    return this.sendMessage(
      `R|${this.getAndSetIndex()}|${RequestEnum.LOAD_USER_ATTR_VALUES}|${userName}|${mapResponseToStringArray(
        attributes
      ).join('|')}`
    );
  }
}
