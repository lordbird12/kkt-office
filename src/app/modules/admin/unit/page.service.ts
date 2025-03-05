import {
    HttpClient,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpHeaders,
    HttpInterceptor,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { environment } from 'environments/environment.development';
import { Form } from '@angular/forms';
import { DataTablesResponse } from 'app/shared/datatable.types';
const token = localStorage.getItem('accessToken') || null;

@Injectable({ providedIn: 'root' })
export class PageService {
    // Private
    private _data: BehaviorSubject<any | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    httpOptionsFormdata = {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    create(data: FormData): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/unit', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    updateUnitProduct(data: FormData): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/product_unit', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    update(id: any, data: FormData): Observable<any> {
        return this._httpClient
            .put<any>(environment.baseURL + '/api/unit/' + id, data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    delete(id: any): Observable<any> {
        return this._httpClient.delete<any>(
            environment.baseURL + '/api/unit/' + id,
            { headers: this.httpOptionsFormdata.headers }
        );
    }
    getbyid(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/unit/' + id)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getPosition(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/positions')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getPermission(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_permission')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getUnit(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_unit')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    /**
     * Get products
     *
     *
     * @param page
     * @param perPage
     * @param sortBy
     * @param order
     * @param search
     */

    getPage(dataTablesParameters: any): Observable<DataTablesResponse> {
        return this._httpClient
            .post(
                environment.baseURL + '/api/unit_page',
                dataTablesParameters,
                this.httpOptionsFormdata
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

    getWarehouse(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/area/' + id)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getCategory(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/category_product/' + id)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    newFloor(data: any): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/floor', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getFloor(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/floor/' + id)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getFloorAll(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_floor/' + id)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    newChannel(data: any): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/channel', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getChannel(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/channel/' + id)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getChannelAll(id1: any, id2: any): Observable<any> {
        return this._httpClient
            .get<any>(
                environment.baseURL + '/api/get_channel/' + id1 + '/' + id2
            )
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    updateFloor(data: any, id: any): Observable<any> {
        return this._httpClient
            .put(environment.baseURL + '/api/floor/' + id, data)
            .pipe(
                switchMap((response: any) => {
                    // Return a new observable with the response
                    return of(response);
                })
            );
    }

    updateChanel(data: any, id: any): Observable<any> {
        return this._httpClient
            .put(environment.baseURL + '/api/channel/' + id, data)
            .pipe(
                switchMap((response: any) => {
                    // Return a new observable with the response
                    return of(response);
                })
            );
    }

    getArea(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_area')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }
}
