import { CallState } from 'src/app/shared/constants/callstate.constant';

export interface UserListComponentStoreData {
  callState: CallState;
  listOfUsers: string[];
  detailsCallState: CallState;
  listOfAttributes: Record<string, string>;
}
