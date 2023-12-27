import { Observable } from 'rxjs';

export const tapWebsocketResponse = () => {
  return function (source: Observable<string>): Observable<string> {
    return new Observable(subscriber => {
      source.subscribe({
        next(value) {
          const successResponse = value.split('|')[4] === '1';

          if (successResponse) {
            subscriber.next(value);
          } else {
            subscriber.error({ error: value.split('|')[5] });
          }
        },
        error(error) {
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        },
      });
    });
  };
};
