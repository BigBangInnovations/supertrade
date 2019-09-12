import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Retailer } from '../_models/retailer.model';
import { HttpParams } from "@angular/common/http";
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CommonResponseDirectData } from '../../common/common.model';
@Injectable()
export class RetailerService {
    constructor(private http: HttpClient) {}

    search(data: any): Observable<any> {
        const url = environment.apiEndpoint+`get-retailer`;
          return this.http.post<Retailer[]>(url, data)
          .pipe(
            tap((response:any) => {
              response.map = response.data[0].retailers
                .map(retailers => {
                  let _distributor = new Retailer();
                  _distributor.ID = retailers.ID,
                  _distributor.Mobile_No = retailers.Mobile_No
                  _distributor.Name = retailers.Name; 
                  return _distributor
                })
              return response;
            })
            );
  
        }

    // Sales
    getAllretailer(data: any): Observable<any> {
        const url = `get-retailer`;
        return this.http.post<Retailer[]>(url, data);
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
