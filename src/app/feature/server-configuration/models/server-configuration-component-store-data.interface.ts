import { CallState } from 'src/app/shared/constants/callstate.constant';
import { ServerSetting } from './server-setting.interface';

export interface ServerConfigurationComponentStoreData {
  callState: CallState;
  settingList: ServerSetting[];
}
