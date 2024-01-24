import { Component, OnInit } from '@angular/core';
import { ServerService } from './service/server.service';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  startWith,
} from 'rxjs';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom-respones';
import { DataState } from './enum/data-state.enum';
import { Status } from './enum/status.enum';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Server } from './interface/server';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  appState$: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;
  private filterSubject = new BehaviorSubject<string>('');

  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();

  private isLoading  = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  filterForm: FormGroup;
  selectedStatus: string = 'ALL';

  constructor(
    private serverService: ServerService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeFilterForm();
    this.appState$ = this.serverService.servers$.pipe(
      map((res) => {
        this.dataSubject.next(res);
        return {
          dataState: DataState.LOADED_STATE,
          appData: res,
        };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  }

  initializeFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      status: 'ALL',
    });
  }

  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress).pipe(
      map((res) => {
        const index = this.dataSubject.value.data.servers.findIndex(
          (server) => server.id === res.data.server.id
        );

        this.dataSubject.value.data.servers[index] = res.data.server;
        this.filterSubject.next('');

        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value,
      }),
      catchError((error: string) => {
        this.filterSubject.next('');
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  }

  filterServer(): void {
    const selectedStatus = this.filterForm.get('status').value;

    this.appState$ = this.serverService
      .filter$(selectedStatus, this.dataSubject.value)
      .pipe(
        map((res) => {
          return {
            dataState: DataState.LOADED_STATE,
            appData: res,
          };
        }),
        startWith({
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error: error });
        })
      );
  }

  saveServer(serverForm: NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.serverService.save$(serverForm.value as Server).pipe(
      map((res) => {
        this.dataSubject.next({
          ...res,
          data: {
            servers: [res.data.server, ...this.dataSubject.value.data.servers],
          },
        });
        document.getElementById('closeModal').click();
        this.isLoading.next(false);
        serverForm.resetForm({
          status: this.Status.SERVER_DOWN,
        });
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value,
      }),
      catchError((error: string) => {
        this.isLoading.next(false);
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  }
}
