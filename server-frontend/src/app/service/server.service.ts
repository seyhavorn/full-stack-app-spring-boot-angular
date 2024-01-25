import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomResponse } from '../interface/custom-respones';
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private readonly apiUrl = 'http://localhost:8080/server';

  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private readonly options = { headers: this.headers };

  constructor(private http: HttpClient) {}

  servers$ = <Observable<CustomResponse>>(
    this.http
      .get<CustomResponse>(`${this.apiUrl}/list`)
      .pipe(tap(console.log), catchError(this.handleError))
  );

  save$ = (server: Server): Observable<CustomResponse> =>
    this.http
      .post<CustomResponse>(
        `${this.apiUrl}/save`,
        JSON.stringify(server),
        this.options
      )
      .pipe(tap(console.log), catchError(this.handleError));

  ping$ = (ipAddress: String) =>
    <Observable<CustomResponse>>(
      this.http
        .get<CustomResponse>(`${this.apiUrl}/ping/${ipAddress}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  filter$ = (status: Status, response: CustomResponse) =>
    <Observable<CustomResponse>>new Observable<CustomResponse>((subscriber) => {
      console.log(response);
      subscriber.next(
        status === Status.ALL
          ? { ...response, message: `Servers filtered by ${status} status` }
          : {
              ...response,
              message:
                response.data.servers.filter(
                  (server) => server.status === status
                ).length > 0
                  ? `Servers filtered by ${
                      status === Status.SERVER_UP ? 'SERVER_UP' : 'SERVER_DOWN'
                    } status`
                  : `No servers of ${status} found`,
              data: {
                servers: response.data.servers?.filter(
                  (server) => server.status === status
                ),
              },
            }
      );
      subscriber.complete();
    }).pipe(tap(console.log), catchError(this.handleError));

  delete$ = (serverId: number) =>
    <Observable<CustomResponse>>(
      this.http
        .delete<CustomResponse>(`${this.apiUrl}/delete/${serverId}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occoured - Error code: ${error.status}`);
  }
}
