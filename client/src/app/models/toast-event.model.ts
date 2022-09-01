export enum EventTypes {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export interface SnackbarEvent {
  type: EventTypes;
  message: string;
}
