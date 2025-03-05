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
export class Service {
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
            .post<any>(environment.baseURL + '/api/user', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    

    update(data: any, id: any): Observable<any> {
        return this._httpClient
            .put<any>(environment.baseURL + '/api/employees/' + id, data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    delete(id: any): Observable<any> {
        return this._httpClient.delete<any>(
            environment.baseURL + '/api/product/' + id,
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
    getUnit(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_unit')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }
    uploadImg(img: FormData): Observable<any> {
        return this._httpClient
            .post(
                environment.baseURL + '/api/upload_images',
                img,
                this.httpOptionsFormdata
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
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
    getSubCategories(id: any): Observable<any> {
        return this._httpClient
            .get<any>(
                environment.baseURL + '/api/get_sub_category_product/' + id
            )
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }
    getFloor(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_floor/' + id)
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }
    getChannel(id1: any, id2: any): Observable<any> {
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

    getShelf(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_shelf')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }
    getSuppliers(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_supplier')
            .pipe(
                tap((data) => {
                    this._data.next(data);
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
    getById(Id: any): Observable<any> {
        return this._httpClient
            .get(environment.baseURL + `/api/product/${Id}`)
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }
    getCategory3(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_size')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }
    Savedata(formData: FormData): Observable<any> {
        return this._httpClient
            .post(environment.baseURL + '/api/product', formData)
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }
    Updatedata(formData: FormData): Observable<any> {
        return this._httpClient
            .post(environment.baseURL + '/api/update_product', formData)
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }
    updateRaw(formData: any): Observable<any> {
        return this._httpClient
            .post(environment.baseURL + '/api/update_product', formData)
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
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
                environment.baseURL + '/api/product_page',
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
            .get<any>(environment.baseURL + '/api/product/' + id)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getProduct(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_product')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
}
