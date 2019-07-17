import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../_models/product.model';
import { catchError, map } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { HttpParams } from "@angular/common/http";

const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/sales';

@Injectable()
export class ProductService {
    constructor(private http: HttpClient) {}

    // Sales
    getAllproducts(): Observable<any> {
        const url = `get-product-with-category`;
        let httpParams = new HttpParams();
        return this.http.post<Product[]>(url, httpParams);
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
