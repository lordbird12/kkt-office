import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any> {
        return this._httpClient.get('api/dashboards/project').pipe(
            tap((response: any) => {
                this._data.next(response);
            }),
        );
    }

    // getDatas(): Observable<any> {
    //     return this._httpClient.get(environment.baseURL + '/api/dashboard').pipe(
    //       tap((response: any) => {

    //          this._data.next(response.data);
    //          console.log("ดูข้อมูล",response.data);

    //       }),
    //     );
    //   }

    getDatas(): Observable<any> {
        return this._httpClient.get(environment.baseURL + '/api/dashboard').pipe(
            tap((response: any) => {
                sessionStorage.setItem('lastweek', JSON.stringify(response.data.lastweek)); // สร้าง session storage ชื่อ last_weeks และเก็บข้อมูล response.data.last_weeks
                sessionStorage.setItem('mon', JSON.stringify(parseInt(response.data.lastweek.mon, 10)));
                sessionStorage.setItem('tue', JSON.stringify(parseInt(response.data.lastweek.tue, 10)));
                sessionStorage.setItem('wed', JSON.stringify(parseInt(response.data.lastweek.wed, 10)));
                sessionStorage.setItem('thu', JSON.stringify(parseInt(response.data.lastweek.thu, 10)));
                sessionStorage.setItem('fri', JSON.stringify(parseInt(response.data.lastweek.fri, 10)));
                sessionStorage.setItem('sat', JSON.stringify(parseInt(response.data.lastweek.sat, 10)));
                sessionStorage.setItem('sun', JSON.stringify(parseInt(response.data.lastweek.sun, 10))); 

                sessionStorage.setItem('factory', JSON.stringify(parseInt(response.data.summarys.factory, 10))); 
                sessionStorage.setItem('in', JSON.stringify(parseInt(response.data.summarys.in, 10))); 
                sessionStorage.setItem('material', JSON.stringify(parseInt(response.data.summarys.material, 10))); 
                sessionStorage.setItem('orders', JSON.stringify(parseInt(response.data.summarys.orders, 10))); 
                sessionStorage.setItem('out', JSON.stringify(parseInt(response.data.summarys.out, 10))); 
                sessionStorage.setItem('packaging', JSON.stringify(parseInt(response.data.summarys.packaging, 10))); 
                sessionStorage.setItem('products', JSON.stringify(parseInt(response.data.summarys.products, 10))); 

                const githubIssuesData = response.githubIssues;
                this._data.next(githubIssuesData);
            }),
        );
    }

    //   getDatas(): Observable<any> {
    //     return this._httpClient.get(environment.baseURL + '/api/dashboard').pipe(
    //         tap((response: any) => {
    //             console.log("ใน sercvice",response.data.last_weeks); // แสดงข้อมูล response ใน console
    //             sessionStorage.setItem('lastweek', JSON.stringify(response.data.last_weeks)); // สร้าง session storage ชื่อ last_weeks และเก็บข้อมูล response.data.last_weeks
    //             sessionStorage.setItem('mon', JSON.stringify(response.data.last_weeks.mon));
    //             sessionStorage.setItem('tue', JSON.stringify(response.data.last_weeks.tue));
    //             sessionStorage.setItem('wed', JSON.stringify(response.data.last_weeks.wed));
    //             sessionStorage.setItem('thu', JSON.stringify(response.data.last_weeks.thu));
    //             sessionStorage.setItem('fri', JSON.stringify(response.data.last_weeks.fri));
    //             sessionStorage.setItem('sat', JSON.stringify(response.data.last_weeks.sat));
    //             sessionStorage.setItem('sun', JSON.stringify(response.data.last_weeks.son));
    //             const githubIssuesData = response.githubIssues;
    //             this._data.next(githubIssuesData);
    //           }),
    //     );
    //   }


}
