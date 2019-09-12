import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Distributor } from '../_models/distributor.model';
import { HttpParams } from "@angular/common/http";
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CommonResponseDirectData } from '../../common/common.model';

@Injectable()
export class DistributorService {
    constructor(private http: HttpClient) {}

    search(data: any): Observable<any> {
      const url = environment.apiEndpoint+`get-distributor`;
        return this.http.post<Distributor[]>(url, data)
        // return this.http.post(environment.commonServiceApiLiveTest+'getTaggedCustomersDetails', {params:data})
        .pipe(
          tap((response:any) => {
            response.map = response.data[0].distributors
              .map(distributors => {
                let _distributor = new Distributor();
                _distributor.ID = distributors.ID,
                _distributor.Mobile_No = distributors.Mobile_No
                _distributor.Name = distributors.Name; 
                return _distributor
              })
            return response;
          })
          );

          //Super sales
          // return this.http.post(environment.commonServiceApiLiveTest+'getTaggedCustomersDetails', {params:data})
        // .pipe(
        //   tap((response:any) => {
        //     response.map = response.map.data
        //       .map(distributors => {
        //         let _distributor = new Distributor();
        //         _distributor.ID = distributors.ID,
        //         _distributor.Mobile_No = distributors.Mobile_No
        //         _distributor.Name = distributors.Name; 
        //         return _distributor
        //       })
        //     return response;
        //   })
        //   );
      }

    // Sales
    getAlldistributor(data: any): Observable<any> {
        const url = `get-distributor`;
        return this.http.post<Distributor[]>(url, data);
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
