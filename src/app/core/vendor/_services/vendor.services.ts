import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Vendor } from '../_models/vendor.model';
import { HttpParams } from "@angular/common/http";
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CommonResponseDirectData } from '../../common/common.model';

@Injectable()
export class VendorService {
    constructor(private http: HttpClient) {}

    search(data: any): Observable<any> {
      const url = environment.apiEndpoint+`get-vendor`;
        return this.http.post<Vendor[]>(url, data)
        // return this.http.post(environment.commonServiceApiLiveTest+'getTaggedCustomersDetails', {params:data})
        .pipe(
          tap((response:any) => {
            response.map = response.data[0].vendors
              .map(vendors => {
                return vendors;
                // let _vendor = new Vendor();
                // _vendor.ID = vendors.ID,
                // _vendor.Mobile_No = vendors.Mobile_No
                // _vendor.Name = vendors.Name; 
                // return _vendor
              })
            return response;
          })
          );

          //Super sales
          // return this.http.post(environment.commonServiceApiLiveTest+'getTaggedCustomersDetails', {params:data})
        // .pipe(
        //   tap((response:any) => {
        //     response.map = response.map.data
        //       .map(vendors => {
        //         let _vendor = new Vendor();
        //         _vendor.ID = vendors.ID,
        //         _vendor.Mobile_No = vendors.Mobile_No
        //         _vendor.Name = vendors.Name; 
        //         return _vendor
        //       })
        //     return response;
        //   })
        //   );
      }

    // Sales
    getAllvendor(data: any): Observable<any> {
        const url = `get-vendor`;
        return this.http.post<Vendor[]>(url, data);
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
