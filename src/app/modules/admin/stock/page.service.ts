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
import { Form, FormGroup } from '@angular/forms';
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

    create(data: any): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/stock_trans', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    update_stock(data: any): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/stock_trans', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    updateinout(id: any, data: any): Observable<any> {
        return this._httpClient
            .put<any>(environment.baseURL + '/api/stock_trans/' + id, data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    update(data: any, id: any): Observable<any> {
        return this._httpClient
            .put<any>(environment.baseURL + '/api/factories/' + id, data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    updateStatus(data: any, id: any): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/update_status_fac', {
                id: id,
                status: data,
            })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    updateApprove(data: any): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/update_approve_fac', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    delete(id: any): Observable<any> {
        return this._httpClient.delete<any>(
            environment.baseURL + '/api/factories/' + id,
            { headers: this.httpOptionsFormdata.headers }
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
                environment.baseURL + '/api/factories_page',
                dataTablesParameters,
                this.httpOptionsFormdata
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

    getProduct(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_product')
            .pipe(
                tap((meterial) => {
                    this._data.next(meterial);
                })
            );
    }

    getOrder(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_orders')
            .pipe(
                tap((meterial) => {
                    this._data.next(meterial);
                })
            );
    }
    getProductFiltter(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_product_type/' + id)
            .pipe(
                tap((meterial) => {
                    this._data.next(meterial);
                })
            );
    }
    getProductt(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_product_type')
            .pipe(
                tap((meterial) => {
                    this._data.next(meterial);
                })
            );
    }
    getById(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/stock_trans/' + id)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getByIdOrder(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/orders/' + id)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getCategories(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_category_product')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }
    getUnit(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_unit')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }
}
