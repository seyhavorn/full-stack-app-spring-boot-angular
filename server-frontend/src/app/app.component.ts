import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { NotificationService } from './service/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  appState$: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;
  private filterSubject = new BehaviorSubject<string>('');

  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();

  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  filterForm: FormGroup;
  selectedStatus: string = 'ALL';

  constructor(
    private serverService: ServerService,
    private formBuilder: FormBuilder,
    private notifier: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeFilterForm();
    this.appState$ = this.serverService.servers$.pipe(
      map((res) => {
        this.notifier.onSuccess(res.message);
        this.dataSubject.next(res);
        return {
          dataState: DataState.LOADED_STATE,
          appData: { ...res, data: { servers: res.data.servers.reverse() } },
        };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        this.notifier.onError(error);
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
        this.notifier.onDefault(res.message);
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
        this.notifier.onError(error);
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
          this.notifier.onDefault(res.message);
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
          this.notifier.onError(error);
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
        this.notifier.onSuccess(res.message);
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
        this.notifier.onError(error);
        this.isLoading.next(false);
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  }

  deleteServer(server: Server): void {
    console.log(server);

    this.appState$ = this.serverService.delete$(server.id).pipe(
      map((res) => {
        this.dataSubject.next({
          ...res,
          data: {
            servers: this.dataSubject.value.data.servers.filter(
              (s) => s.id !== server.id
            ),
          },
        });
        this.notifier.onDefault(res.message);
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
        this.notifier.onError(error);
        this.filterSubject.next('');
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  }

  printReport(): void {
    this.notifier.onDefault('Report downloaded');
    let dataType = 'application/vnd.ms-excel.sheet.macroEnable.12';
    let tableSelect = document.getElementById('servers');
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHtml;
    downloadLink.download = 'server-report.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
