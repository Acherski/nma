export enum RequestEnum {
  // common
  ECHO = 'ECH',
  HELP = 'HLP',

  // auth
  LOGIN = 'LOG',
  LOGIN_WITH_TOKEN = 'LOT',
  CHANGE_PASSWORD_ADMIN_MODE = 'PWA',
  CHANGE_PASSWORD = 'PWD',
  REGISTER = 'REG',

  // user
  LOAD_USERS = 'LSU',
  LOAD_USER_ATTR_KEYS = 'LUA',
  LOAD_USER_ATTR_VALUES = 'GUA',
  REMOVE_USER = 'RMU',
  SET_ATTR = 'SUA',
  REMOVE_ATTR = 'DUA',
}
