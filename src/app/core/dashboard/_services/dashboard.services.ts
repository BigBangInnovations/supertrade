import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Purchase } from '../../purchase/_models/purchase.model'

@Injectable()
export class DashboardService {
    constructor(private http: HttpClient) { }

    getPurchases(data: any): Observable<any> {
        const url = `get-purchase`;
        return this.http.post<Purchase[]>(url, data);
    }
    /*
     * Handle Http operation that failed.
     * Let the app continue.
   *
   * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: any) {
        return (error: any): Observable<any> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result);
        };
    }
}