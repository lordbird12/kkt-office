import {
    HttpClient,
    HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    Observable,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { environment } from 'environments/environment.development';
import { DataTablesResponse } from 'app/shared/datatable.types';
import { param } from 'jquery';
const token = localStorage.getItem('accessToken') || null;

@Injectable({ providedIn: 'root' })
export class AddressService {
    // Private
    private _data: BehaviorSubject<any | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) { }

    httpOptionsFormdata = {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    getProvince(): Observable<any> {
        return this._httpClient
            .get<any>('https://docdelivery.dev-asha.com:8443/api/provinces')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getDistricts(provinceCode: any): Observable<any> {
        return this._httpClient
            .get<any>('https://docdelivery.dev-asha.com:8443/api/districts',
                {
                    params: {
                        province_code: provinceCode
                    }
                }
            )
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getSubDistricts(districtCode: any): Observable<any> {
        return this._httpClient
            .get<any>('https://docdelivery.dev-asha.com:8443/api/sub_districts',
                {
                    params: {
                        district_code: districtCode
                    }
                }
            )
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
                environment.baseURL + '/api/client_page',
                dataTablesParameters,
                this.httpOptionsFormdata
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

    getById(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/client/' + id)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
}
